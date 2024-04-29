// DarkTheme.js

import { DefaultTheme } from "react-native-paper";

const darkTheme = {
  ...DefaultTheme,
  // Customize the dark theme properties
  colors: {
    primary: "rgb(255,210,208)",
    onPrimary: "rgb(0, 42, 120)",
    primaryContainer: "rgb(35, 66, 144)",
    onPrimaryContainer: "rgb(219, 225, 255)",
    secondary: "rgb(193, 197, 221)",
    onSecondary: "rgb(43, 48, 66)",
    secondaryContainer: "rgb(65, 70, 89)",
    onSecondaryContainer: "rgb(221, 225, 249)",
    tertiary: "rgb(165, 200, 255)",
    onTertiary: "rgb(0, 49, 95)",
    tertiaryContainer: "rgb(0, 71, 134)",
    onTertiaryContainer: "rgb(212, 227, 255)",
    error: "rgb(255, 180, 171)",
    onError: "rgb(105, 0, 5)",
    errorContainer: "rgb(147, 0, 10)",
    onErrorContainer: "rgb(255, 180, 171)",
    background: "rgb(27, 27, 27)",
    onBackground: "rgb(174, 32, 79)",
    surface: "rgb(27, 27, 31)",
    onSurface: "rgb(228, 226, 230)",
    surfaceVariant: "rgb(48, 48, 52)",
    onSurfaceVariant: "rgb(197, 198, 208)",
    outline: "rgb(143, 144, 154)",
    outlineVariant: "rgb(69, 70, 79)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(228, 226, 230)",
    inverseOnSurface: "rgb(48, 48, 52)",
    inversePrimary: "rgb(62, 90, 169)",
    elevation: {
      level0: "transparent",
      level1: "rgb(35, 36, 42)",
      level2: "rgb(39, 41, 49)",
      level3: "rgb(44, 46, 56)",
      level4: "rgb(45, 47, 58)",
      level5: "rgb(48, 51, 62)",
    },
    surfaceDisabled: "rgba(228, 226, 230, 0.12)",
    onSurfaceDisabled: "rgba(228, 226, 230, 0.38)",
    backdrop: "rgba(46, 48, 56, 0.4)",
  },

  // Other custom theme properties for dark mode
};

export default darkTheme;
