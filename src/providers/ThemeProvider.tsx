import {
  DefaultTheme as NavigationLightTheme,
  DarkTheme as NavigationDarkTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { Appearance, ColorSchemeName, useColorScheme } from "react-native";
import {
  MD3LightTheme,
  MD3DarkTheme,
  PaperProvider,
  adaptNavigationTheme,
  configureFonts,
} from "react-native-paper";

import { storage } from "../utils/mmkv";

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
};

interface PreferredThemeContextProps {
  toggleTheme: (theme: ColorSchemeName) => void;
  usingSystemTheme: boolean;
}

const PreferredThemeContext = createContext<PreferredThemeContextProps>({
  toggleTheme: () => null,
  usingSystemTheme: true,
});

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    InterVariable: require("../assets/fonts/InterVariable.ttf"),
  });

  const [usingSystemTheme, setUsingSystemTheme] = useState<boolean>(true);

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

  useEffect(() => {
    async function loadTheme() {
      const savedTheme = storage.getString("preferred_theme") as ColorSchemeName;
      Appearance.setColorScheme(savedTheme);
      setUsingSystemTheme(!savedTheme);
    }

    loadTheme();
  }, []);

  const toggleTheme = (newTheme: ColorSchemeName) => {
    if (newTheme) storage.set("preferred_theme", newTheme);
    else storage.delete("preferred_theme");

    Appearance.setColorScheme(newTheme);
    setUsingSystemTheme(!newTheme);
  };

  return (
    <PreferredThemeContext.Provider value={{ toggleTheme, usingSystemTheme }}>
      <PaperProvider theme={configuredTheme}>
        <NavigationThemeProvider value={configuredTheme}>{children}</NavigationThemeProvider>
      </PaperProvider>
    </PreferredThemeContext.Provider>
  );
}

export function usePreferredTheme() {
  const context = useContext(PreferredThemeContext);
  if (process.env.NODE_ENV !== "production" && !context) {
    throw new Error("usePreferredTheme must be wrapped in a <ThemeProvider />");
  }

  return context;
}
