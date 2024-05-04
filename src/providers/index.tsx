import { ReactNode } from "react";
import { SheetProvider } from "react-native-actions-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ToastProvider } from "react-native-toast-notifications";

import { AuthProvider } from "./AuthProvider";
import QueryProvider from "./QueryProvider";
import ThemeProvider from "./ThemeProvider";
import "../components/ui/sheets";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <QueryProvider>
            <ThemeProvider>
              <SheetProvider>
                <ToastProvider>{children}</ToastProvider>
              </SheetProvider>
            </ThemeProvider>
          </QueryProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
