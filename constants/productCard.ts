import { SPACING } from "./spacing";

// Shared sizing math for the product card (components/MenuItem.tsx) and its
// loading skeleton (components/ProductCardSkeleton.tsx), so both layouts —
// and the FlashLists that render them — agree on real dimensions instead of
// each guessing independently.
export const ROW_CARD_WIDTH = 140;
export const GRID_GAP = SPACING.sm; // total horizontal gap between the two grid columns
export const CARD_TEXT_BLOCK_HEIGHT = 72; // 1-line name + price row + vertical padding
export const CARD_BOTTOM_MARGIN = 8; // MenuItem/ProductCardSkeleton's card container marginBottom

export function getGridCardWidth(screenWidth: number): number {
  return (screenWidth - SPACING.xl * 2 - GRID_GAP) / 2;
}

export function getCardImageHeight(cardWidth: number): number {
  return cardWidth * 1.5; // portrait 2:3
}

export function getCardHeight(cardWidth: number): number {
  return getCardImageHeight(cardWidth) + CARD_TEXT_BLOCK_HEIGHT + CARD_BOTTOM_MARGIN;
}
