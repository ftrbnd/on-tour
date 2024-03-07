import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { MD3LightTheme as DefaultTheme, PaperProvider } from "react-native-paper";

import { AuthProvider } from "../providers/AuthProvider";

const queryClient = new QueryClient();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "tomato",
    secondary: "yellow",
  },
};

export default function AppLayout() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={theme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </PaperProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
