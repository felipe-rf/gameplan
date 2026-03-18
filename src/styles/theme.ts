export type Themes = keyof typeof themes;

export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
} as const;

export const display = {
  // No "[Scale: Display]" variable collection found
} as const;

export const typography = {
  // No "[Scale: Fonts]" variable collection found
} as const;

export const font = {
  regular: "InstrumentSans_400Regular",
  bold: "InstrumentSans_700Bold",
} as const;

export const palette = {
  // No "[Scale: Colors]" variable collection found
} as const;

export const themes = {
  main: {
    colors: {
      primary: "#72E0BC",
      background: "#0b132b",
      secondary: "#3a506b",
      white: "#ffffff",
      danger: "#ff6f6f",
    },
    breakpoints,
    display,
    font,
    palette,
    typography,
  },
} as const;

export const initialTheme: Themes = "main" as const;

export const themeColors = themes.main.colors;

export const COLORS = {
  primary: themeColors.primary,
  background: themeColors.background,
  secondary: themeColors.secondary,
  panel: themeColors.secondary,
  border: themeColors.primary,
  textPrimary: themeColors.primary,
  textSecondary: themeColors.secondary,
  textMuted: themeColors.secondary,
  blue: themeColors.primary,
  red: themeColors.secondary,
  green: themeColors.primary,
  greenSuccess: themeColors.primary,
  buttonNeutral: themeColors.secondary,
} as const;
