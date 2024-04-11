import { ReactNode } from "react";
import { useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";

// const theme = {
//   ...MD3LightTheme,
//   colors: {
//     ...MD3LightTheme.colors,
//     primary: "tomato",
//     secondary: "yellow",
//   },
// };

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const colorScheme = useColorScheme();

  return (
    <PaperProvider theme={colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme}>
      {children}
    </PaperProvider>
  );
}
