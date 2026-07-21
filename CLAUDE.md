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

**Tech stack:** Expo 54 · Expo Router v6 (file-based routing) · React 19 · TypeScript (strict) · Firebase Auth · AsyncStorage

### Routing & Screens

Expo Router maps the filesystem under `/app/` to routes:
- `index.tsx` — auth guard: redirects to `/(tabs)/menu` if logged in, else `/login`
- `(tabs)/` — bottom tab navigator (menu, cart, orders, profile, about)
- `item/[id].tsx` — dynamic product detail page

### State Management

All state lives in React Context providers composed in `/providers/AppProviders.tsx`. Contexts:

| Context | Persistence | Notes |
|---|---|---|
| `UserContext` | Firebase Auth | Primary auth context; use `useUser()` hook |
| `CartContext` | In-memory (session only) | Cleared on restart — intentional for MVP |
| `FavoritesContext` | AsyncStorage | Survives restarts |
| `ThemeContext` | AsyncStorage | Light/dark with system detection; platform-specific iOS/Android handling |
| `OrdersContext` | In-memory | No backend persistence yet |
| `WalletContext` | In-memory | No backend persistence yet |
| `AuthContext` | — | Legacy mock auth; superceded by UserContext |

### Authentication Flow

Firebase Auth (email/password + Google OAuth). `lib/firebase.ts` reads credentials from `EXPO_PUBLIC_*` env vars. Google OAuth client IDs are platform-specific (web vs Android); configured in `app.json` under `expo-auth-session`.

### Menu Data

All menu items are static TypeScript arrays in `/api/`. `mockData.ts` aggregates them all. Category item counts in `/constants/categories.ts` are auto-calculated from `mockData`. Menu categories: Soda, Milk, Coffee, Matcha, Chocolate, Signature, Other.

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

Copy `.env.example` to `.env` and fill in Firebase and Google OAuth credentials:

```
EXPO_PUBLIC_FIREBASE_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
EXPO_PUBLIC_FIREBASE_PROJECT_ID
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
EXPO_PUBLIC_FIREBASE_APP_ID
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID
```

## Key Architectural Notes

- `UserContext` is the authoritative auth context. `AuthContext` is a leftover mock — do not add new logic there.
- Cart and order state is intentionally in-memory (no Firestore integration yet).
- OTA updates are configured via `expo-updates` with EAS; the root `_layout.tsx` checks for updates on launch.
- Path alias `@/*` maps to the project root (configured in `tsconfig.json`).
