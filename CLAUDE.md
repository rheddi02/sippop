# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Start Expo dev server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run web        # Run web version
npm run lint       # ESLint (expo-lint flat config)
npm run reset-project  # Reset to blank Expo template
```

No test framework is configured — lint only.

## Architecture Overview

Aysippop Store is an Expo/React Native mobile ordering app for a tea & coffee shop. Users browse menu items, add to cart, and check out via Facebook Messenger.

**Tech stack:** Expo 54 · Expo Router v6 (file-based routing) · React 19 · TypeScript (strict) · Supabase Auth · AsyncStorage

### Routing & Screens

Expo Router maps the filesystem under `/app/` to routes:
- `index.tsx` — auth guard: redirects to `/(tabs)/menu` if logged in, else `/login`
- `(tabs)/` — bottom tab navigator (menu, cart, orders, profile, about)
- `item/[id].tsx` — dynamic product detail page

### State Management

All state lives in React Context providers composed in `/providers/AppProviders.tsx`. Contexts:

| Context | Persistence | Notes |
|---|---|---|
| `UserContext` | Supabase Auth | Primary (and only) auth context; use `useUser()` hook |
| `CartContext` | In-memory (session only) | Cleared on restart — intentional for MVP |
| `FavoritesContext` | AsyncStorage | Survives restarts |
| `ThemeContext` | AsyncStorage | Light/dark with system detection; platform-specific iOS/Android handling |
| `OrdersContext` | In-memory | No backend persistence yet (Supabase-backed orders/points/credit are a planned follow-up) |

### Authentication Flow

Supabase Auth (email/password + Google + Facebook OAuth). `lib/supabase.ts` reads credentials from `EXPO_PUBLIC_SUPABASE_*` env vars. Google sign-in uses the native `@react-native-google-signin/google-signin` SDK, exchanging its ID token via `supabase.auth.signInWithIdToken`. Facebook sign-in uses Supabase's browser-redirect OAuth flow (`supabase.auth.signInWithOAuth` + `expo-web-browser`) rather than a native SDK, since Facebook's classic access-token flow isn't compatible with `signInWithIdToken`. Both providers must be configured in the Supabase dashboard (Authentication > Providers). Google is Android-only (no iOS client configured — this app doesn't ship to iOS).

Supabase blocks sign-in for accounts pending email confirmation (a real behavioral difference from the Firebase Auth this replaced, which allowed signing in before verifying) — `UserContext` exposes a `pendingEmail` field for the just-registered, not-yet-confirmed state, since there's no session/`user` to hang that off of yet.

### Menu Data

Menu items are read live from the shop's POS Supabase project's `products` table via `api/menu.ts`'s `fetchMenu()` (module-level in-memory cache, no React Query). The POS schema has a single flat `price` per product and no sizes/variants table, so each product is mapped into `CatalogItem` with a single `"Regular"` size — and no `description` column, so `MenuItem`/`item/[id].tsx` conditionally hide the description line when empty. Category browsing happens via the dedicated `app/category/[id].tsx` screen (reached by tapping a "Shop by Category" cover card on the Menu tab), which filters the fetched menu by `item.category` and looks up its display label from `constants/categories.ts`'s `CATEGORY_LABELS`. Category ids expected: soda, milk, matcha, oreo, coffee, chocolate, hotdrinks, signature, krunch — these must match the POS's `category` column values or that category will show no products.

### Theme System

Colors are defined as light/dark palettes in `/theme/colors.ts`. Components call `useThemeColors()` to get the current palette and apply styles inline. The theme toggle in `ThemeContext` has separate handling for Android (navigation bar color) and iOS.

### Core Types

Defined in `/utils/types.ts`:
- `Product` — `id, name, quantity, price, image, size`
- `CartItem extends Product` — adds `quantity`
- `Order` — `id, items[], total, status: "pending"|"preparing"|"ready"|"delivered", createdAt`

### Checkout Flow

Cart → format order as text → open Facebook Messenger deep link. No payment processing.

## Environment Variables

Copy `.env.example` to `.env` and fill in Supabase and Google OAuth credentials:

```
EXPO_PUBLIC_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID
```

Facebook OAuth credentials (App ID/secret) are configured in the Supabase dashboard, not as app env vars, since Facebook sign-in goes through Supabase's server-side OAuth exchange.

## Key Architectural Notes

- `UserContext` is the sole auth context — `AuthContext` (a mock) and `WalletContext` (an unconnected in-memory balance) were retired; `points`/credit-order state will live in a Supabase `profiles` table in a planned follow-up, exposed via a `useProfile()` hook.
- Cart and order state is intentionally in-memory (no backend persistence yet — a planned follow-up wires real Supabase orders and clears the cart on checkout).
- OTA updates are configured via `expo-updates` with EAS; the root `_layout.tsx` checks for updates on launch.
- Path alias `@/*` maps to the project root (configured in `tsconfig.json`).
