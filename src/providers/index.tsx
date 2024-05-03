import { ReactNode } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ToastProvider } from "react-native-toast-notifications";

import { AuthProvider } from "./AuthProvider";
import QueryProvider from "./QueryProvider";
import ThemeProvider from "./ThemeProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <QueryProvider>
            <ThemeProvider>
              <ToastProvider>{children}</ToastProvider>
            </ThemeProvider>
          </QueryProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
