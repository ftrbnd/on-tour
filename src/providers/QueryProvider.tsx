import NetInfo from "@react-native-community/netinfo";
import { QueryCache, QueryClient, focusManager, onlineManager } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { router } from "expo-router";
import { ReactNode, useEffect } from "react";
import { AppState, AppStateStatus, Platform } from "react-native";

import { clientPersister } from "../utils/mmkv";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: Infinity,
    },
  },
  queryCache: new QueryCache({
    onError: async (error) => {
      if (error.message === "Unauthorized") {
        router.replace("/sign-in?status=401");
      }
    },
  }),
});

const persister = clientPersister;

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  });
});

export default function QueryProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const appStateSubscription = AppState.addEventListener("change", onAppStateChange);

    return () => appStateSubscription.remove();
  }, []);

  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      {children}
    </PersistQueryClientProvider>
  );
}
