export interface ThemeColors {
  background: string;
  text: string;
  primary: string;
  card: string;
  border: string;
  secondary: string;
  accent: string;
  muted: string;
  tint: string;
  danger: string;
}

export interface AppTheme {
  id: string;
  name: string;
  isDark: boolean;
  // Colors sampled for the palette-swatch icon shown in the theme picker.
  swatch: string[];
  colors: ThemeColors;
  // Top-to-bottom gradient stops for the app's screen backgrounds.
  backgroundGradient: [string, string];
}

const defaultColors: ThemeColors = {
  background: "#120D0A", // near-black espresso background
  text: "#F5EDE3", // warm cream text
  primary: "#C9853F", // caramel/amber accent
  card: "#1E1712", // lifted dark-brown card surface
  border: "#382C21", // warm dark border
  secondary: "#8B5A2B", // deeper bronze
  accent: "#E0A458", // golden highlight
  muted: "#A08D78", // warm muted brown-grey
  tint: "#C9853F",
  danger: "#E0524A", // warm red
};

const lightColors: ThemeColors = {
  background: "#FBF6EF", // warm cream background
  text: "#241A12", // dark espresso text
  primary: "#C9853F", // same caramel/amber accent for brand consistency
  card: "#FFFFFF",
  border: "#EAE0D3", // light warm tan border
  secondary: "#8B5A2B",
  accent: "#E0A458",
  muted: "#8A7864",
  tint: "#C9853F",
  danger: "#D64545",
};

export const THEMES: AppTheme[] = [
  {
    id: "default",
    name: "Default",
    isDark: true,
    swatch: [
      defaultColors.background,
      defaultColors.primary,
      defaultColors.accent,
      defaultColors.card,
    ],
    colors: defaultColors,
    backgroundGradient: ["#120D0A", "#2E1B0E"],
  },
  {
    id: "light",
    name: "Light",
    isDark: false,
    swatch: [
      lightColors.background,
      lightColors.primary,
      lightColors.accent,
      lightColors.border,
    ],
    colors: lightColors,
    backgroundGradient: ["#FBF6EF", "#F0E0C8"],
  },
];

export const DEFAULT_THEME_ID = "default";
