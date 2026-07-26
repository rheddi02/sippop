-- Store-wide top-selling products for the customer app's "Top Selling"
-- section. security definer because `orders` RLS restricts reads to
-- auth.uid() = user_id per row (see fetchOrders() in api/orders.ts) — a
-- plain client query can never see cross-customer sales.
--
-- Scope: current calendar month in Asia/Manila local time (the shop's
-- timezone) falling back to the previous calendar month if the current
-- month has zero non-cancelled sales rows yet. Cancelled orders
-- (status = 'cancelled') are excluded from the ranking.
--
-- Returns the FULL aggregated (product_id, quantity) set for the resolved
-- month — no LIMIT here. Capping to "max 5" happens client-side, AFTER
-- re-mapping each raw product_id (a specific size variant) back to its
-- parent CatalogItem, since a multi-size flavor has one products row per
-- size (see SizeOption.productId in utils/types.ts) — several of the top
-- raw rows can just be different sizes of the same flavor, so capping in
-- SQL risks showing fewer than 5 real "Top Selling" cards.

create or replace function public.get_admin_top_selling_products()
returns table (product_id uuid, quantity bigint)
language plpgsql
security definer
set search_path = public
as $$
declare
  -- Naive (zone-less) timestamp representing the start of the current
  -- month in Manila wall-clock time. Interval arithmetic happens on this
  -- naive value (correct regardless of session timezone settings); the
  -- trailing "at time zone" cast converts back to a timestamptz instant
  -- only when used as a bound against created_at.
  v_month_anchor timestamp := date_trunc('month', now() at time zone 'Asia/Manila');
  v_month_start timestamptz := v_month_anchor at time zone 'Asia/Manila';
  v_month_end timestamptz := (v_month_anchor + interval '1 month') at time zone 'Asia/Manila';
begin
  return query
    select (item->>'product_id')::uuid as product_id,
           sum((item->>'quantity')::int)::bigint as quantity
      from public.orders o,
           jsonb_array_elements(o.items) as item
     where o.status <> 'cancelled'
       and o.created_at >= v_month_start
       and o.created_at < v_month_end
     group by (item->>'product_id')::uuid
     order by quantity desc;

  -- FOUND reflects whether the RETURN QUERY above produced any rows.
  if not found then
    v_month_start := (v_month_anchor - interval '1 month') at time zone 'Asia/Manila';
    v_month_end := v_month_anchor at time zone 'Asia/Manila';

    return query
      select (item->>'product_id')::uuid as product_id,
             sum((item->>'quantity')::int)::bigint as quantity
        from public.orders o,
             jsonb_array_elements(o.items) as item
       where o.status <> 'cancelled'
         and o.created_at >= v_month_start
         and o.created_at < v_month_end
       group by (item->>'product_id')::uuid
       order by quantity desc;
  end if;
end;
$$;

grant execute on function public.get_admin_top_selling_products() to authenticated;

notify pgrst, 'reload schema';
