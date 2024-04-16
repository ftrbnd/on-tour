import { ReactNode } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AuthProvider } from "./AuthProvider";
import QueryProvider from "./QueryProvider";
import ThemeProvider from "./ThemeProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <QueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
