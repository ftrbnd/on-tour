import { QueryCache, QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { router } from "expo-router";
import { ReactNode } from "react";

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
        console.log("UNAUTHORIZED");
        router.replace("/(auth)/sign-in");
      }
    },
  }),
});

const persister = clientPersister;

export default function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      {children}
    </PersistQueryClientProvider>
  );
}
