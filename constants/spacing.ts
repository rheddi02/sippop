// Shared layout tokens. theme/colors.ts covers color only — this is the
// single source of truth for spacing/radius/shadow so sections don't drift
// (e.g. the same 20px gutter defined in two places, or one-off radii).
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20, // canonical screen horizontal gutter
  xxl: 24, // vertical rhythm between major sections
};

export const RADIUS = {
  sm: 8, // image corners, skeletons
  md: 12, // cards
  pill: 999, // search bar, category chips, badges
};

export const SHADOW = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
};
