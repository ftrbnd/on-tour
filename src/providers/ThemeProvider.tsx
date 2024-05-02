import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { Appearance, ColorSchemeName, useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";

import { storage } from "../utils/mmkv";

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
  const [usingSystemTheme, setUsingSystemTheme] = useState<boolean>(true);

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
      {/* TODO: remove after conversion complete */}
      <PaperProvider>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={eva[colorScheme ?? "light"]}>
          {children}
        </ApplicationProvider>
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
