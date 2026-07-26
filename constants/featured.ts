import { ImageSourcePropType } from "react-native";

// Local, hand-curated content for sections that have no backing Supabase
// table/RPC/flag today (coming-soon, and the promos fallback). Edit this
// file directly to change what shows — no backend change required.
//
// Promos now come live from the `promos` table (see api/promos.ts) —
// FALLBACK_PROMOS below is only shown when that fetch fails or is empty.
//
// Top Selling is no longer hand-curated here — it's computed live from real
// order data (see api/topSelling.ts and utils/topSelling.ts).
//
// COMING_SOON_IDS references CatalogItem.id as returned by fetchMenu()
// (api/menu.ts), which for a multi-size flavor (e.g. "Blueberry Milk") is
// the *smallest/first size variant's* underlying products row id, not a
// size-specific id. Ids that no longer match anything in the fetched menu
// are silently dropped by getCuratedItems (utils/curatedMenu.ts) rather
// than erroring, so stale/typo'd ids just make the section render fewer
// items instead of crashing — worth double-checking in QA since there's no
// admin UI validating these against the live catalog.
//
// COMING_SOON_IDS still points at currently-active products: fetchMenu()
// only returns is_active:true rows, so "coming soon" here means a product
// marketed as newly-featured, not a genuinely unreleased/inactive one.

export interface PromoConfig {
  id: string;
  title: string;
  subtitle?: string;
  // Optional — when omitted, PromoCarousel renders a themed color-block
  // banner (title/subtitle only) instead of requiring a real marketing
  // asset up front.
  image?: ImageSourcePropType;
  route?: string; // e.g. "/item/<catalogItemId>"; omit for non-pressable
}

export const FALLBACK_PROMOS: PromoConfig[] = [
  {
    id: "promo-signature",
    title: "Try our Signature drinks",
    subtitle: "Affogato, Creamy Ube, and more house specials",
  },
  {
    id: "promo-krunch",
    title: "Krunch season is here",
    subtitle: "Crunchy toppings on your favorite flavors",
  },
  {
    id: "promo-matcha",
    title: "Matcha, your way",
    subtitle: "Hot or iced, classic or strawberry",
  },
];

export const COMING_SOON_IDS: string[] = [
  "7f5fac8a-4c09-4325-81c3-74512ee2348b", // Creamy Ube
  "05c46f48-7c47-45a6-ad49-e81e6c7c44c7", // Strawberry Matcha
  "f307a51a-43ea-4b2a-b843-5109e9e0e908", // Biscoff Latte
];
