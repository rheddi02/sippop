-- Restores the Aysippop customer-app loyalty extension and the place_order RPC.
--
-- Root cause (confirmed by querying information_schema.columns against the
-- live database): the `orders` and `customers` tables match the base POS
-- schema (cost-tracking repo's supabase-schema.sql) exactly. None of
-- status/payment_method/points_earned (orders) or points/credit_balance/
-- credit_limit (customers) exist, and neither does place_order. This is not
-- a side effect of the earlier guest-checkout revert — that script never
-- touched `customers` and only dropped a `guest_token` column it had added
-- itself. The whole loyalty extension appears to have never been applied to
-- this project (or was wiped independently at some point).
--
-- Judgment calls made here — please review before running:
--   1. order_type stays 'sale' for every app order, even ones paid with
--      store credit. Aysippop's credit_balance/credit_limit is a running
--      account limit, a different concept from this POS's per-order
--      utang/is_settled tracking (which is tied to a manually-managed
--      customer_id + settlement flow the owner uses in-person). Setting
--      order_type='credit' here would make app orders show up in the
--      owner's own unsettled-utang dashboard with no customer_id and no
--      way to settle them — so it's deliberately left alone.
--   2. total_cost/total_profit are left at their existing column default
--      (0) for app orders. Real ingredient-cost computation would need a
--      join through product_ingredients/ingredients per line item — can
--      add if you want real profit tracked for app-placed orders too.
--   3. order_number is a running counter per user_id (1, 2, 3... per
--      customer), since it's NOT NULL with no default/sequence on the live
--      table and Aysippop's own code never reads it. This only needs to
--      satisfy the constraint — it's scoped per customer's own user_id, so
--      it can't collide with the shop owner's own order_number sequence
--      (a different user_id).
--   4. Points-earning is temporarily DISABLED (v_points_earned hardcoded to
--      0) — an order is only "placed" here, not fulfilled, and there's no
--      completion-tracking flow yet to award points on delivery instead of
--      at checkout. The intended rule once that exists: 1 point per ₱1 of
--      subtotal, floored, with 0 points on store-credit-paid orders (no
--      double-dipping).
--   5. credit_limit is derived from points, not an independent value:
--      floor(points / 1000) * 100 — locked at ₱0 below 1000 points, then
--      +₱100 every 1000 points (2000 pts -> ₱200, 3000 -> ₱300, ...). This
--      also means it automatically re-locks if points ever drop back below
--      1000, since it's recomputed from the current total every time, never
--      just incremented. A new customer bootstraps at 0 points -> ₱0 limit.
--      With points-earning disabled (#4), this also means credit_limit
--      stays locked at ₱0 for everyone until points-earning is re-enabled.
--   6. A first-order customer's `name` is backfilled from
--      auth.users.raw_user_meta_data (full_name / name, e.g. from Google or
--      Facebook sign-in) falling back to email, since email/password
--      sign-up never collects a display name.

create extension if not exists pgcrypto;

-- 1) New columns

alter table public.orders
add column if not exists status text not null default 'pending';
alter table public.orders
drop constraint if exists orders_status_check;
alter table public.orders
add constraint orders_status_check
check (status in ('pending', 'preparing', 'ready', 'delivered', 'cancelled'));

alter table public.orders
add column if not exists payment_method text not null default 'cash';
alter table public.orders
drop constraint if exists orders_payment_method_check;
alter table public.orders
add constraint orders_payment_method_check
check (payment_method in ('cash', 'credit'));

alter table public.orders
add column if not exists points_earned integer not null default 0;

alter table public.customers
add column if not exists points integer not null default 0;
alter table public.customers
add column if not exists credit_balance numeric not null default 0;
alter table public.customers
add column if not exists credit_limit numeric not null default 0;

-- 2) place_order RPC — mirrors the trust model implied by api/orders.ts's
-- comment ("price is never trusted from the client"): re-looks-up each
-- product's current price server-side, and now also enforces the credit
-- limit server-side rather than trusting the client's own canUseCredit check.

create or replace function public.place_order(
p_items jsonb,
p_use_credit boolean default false
)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
v_order public.orders;
v_items jsonb := '[]'::jsonb;
v_subtotal numeric := 0;
v_item jsonb;
v_product record;
v_line_total numeric;
v_points_earned integer;
v_customer_name text;
v_credit_balance numeric;
v_credit_limit numeric;
v_order_number integer;
begin
if auth.uid() is null then
  raise exception 'authentication required';
end if;

for v_item in select * from jsonb_array_elements(p_items)
loop
  select id, name, price
    into v_product
    from public.products
    where id = (v_item->>'product_id')::uuid
      and is_active = true;

  if not found then
    raise exception 'product % not found or inactive', v_item->>'product_id';
  end if;

  v_line_total := v_product.price * (v_item->>'quantity')::int;
  v_subtotal := v_subtotal + v_line_total;

  v_items := v_items || jsonb_build_object(
    'product_id', v_product.id,
    'name', v_product.name,
    'size', v_item->>'size',
    'quantity', (v_item->>'quantity')::int,
    'unit_price', v_product.price,
    'line_total', v_line_total
  );
end loop;

-- Ensure a customers row exists for this auth user (first-order bootstrap —
-- mirrors the comment in api/profile.ts about place_order creating one).
select credit_balance, credit_limit
  into v_credit_balance, v_credit_limit
  from public.customers
  where user_id = auth.uid();

if not found then
  select coalesce(raw_user_meta_data ->> 'full_name', raw_user_meta_data ->> 'name', email, 'Customer')
    into v_customer_name
    from auth.users
    where id = auth.uid();

  insert into public.customers (id, user_id, name, credit_balance, credit_limit)
  values (gen_random_uuid(), auth.uid(), v_customer_name, 0, 0)
  returning credit_balance, credit_limit into v_credit_balance, v_credit_limit;
end if;

if p_use_credit then
  if v_credit_balance + v_subtotal > v_credit_limit then
    raise exception 'store credit limit exceeded';
  end if;

  update public.customers
      set credit_balance = credit_balance + v_subtotal,
          updated_at = now()
    where user_id = auth.uid();
end if;

-- Disabled for now: an order is only "placed", not fulfilled, at this point,
-- and there's no completion-tracking flow yet to award points on delivery
-- instead of at checkout. Re-enable the real calculation once that exists.
v_points_earned := 0;

update public.customers
    set points = points + v_points_earned,
        credit_limit = floor((points + v_points_earned) / 1000.0) * 100,
        updated_at = now()
  where user_id = auth.uid();

select coalesce(max(order_number), 0) + 1
  into v_order_number
  from public.orders
  where user_id = auth.uid();

insert into public.orders (
  id, user_id, order_number, items, subtotal, created_at,
  status, payment_method, points_earned
) values (
  gen_random_uuid(), auth.uid(), v_order_number, v_items, v_subtotal, now(),
  'pending', case when p_use_credit then 'credit' else 'cash' end, v_points_earned
)
returning * into v_order;

return v_order;
end;
$$;

grant execute on function public.place_order(jsonb, boolean) to authenticated;

notify pgrst, 'reload schema';
