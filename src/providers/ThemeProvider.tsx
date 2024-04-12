import {
  DefaultTheme as NavigationLightTheme,
  DarkTheme as NavigationDarkTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { ReactNode } from "react";
import { useColorScheme } from "react-native";
import {
  MD3LightTheme,
  MD3DarkTheme,
  PaperProvider,
  adaptNavigationTheme,
  configureFonts,
} from "react-native-paper";

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationLightTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedLightTheme = {
  ...MD3LightTheme,
  ...LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...LightTheme.colors,
  },
};

const CombinedDarkTheme = {
  ...MD3DarkTheme,
  ...DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...DarkTheme.colors,
  },
  fonts: configureFonts({
    config: {
      fontFamily: "InterVariable",
    },
  }),
};

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    InterVariable: require("../assets/fonts/InterVariable.ttf"),
  });

  const theme = colorScheme === "dark" ? CombinedDarkTheme : CombinedLightTheme;
  const fontTheme = {
    ...theme,
    fonts: configureFonts({
      config: {
        fontFamily: "InterVariable",
      },
    }),
  };

  const configuredTheme = loaded ? fontTheme : theme;

  return (
    <PaperProvider theme={configuredTheme}>
      <NavigationThemeProvider value={configuredTheme}>{children}</NavigationThemeProvider>
    </PaperProvider>
  );
}
