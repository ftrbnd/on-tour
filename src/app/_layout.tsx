import { Ionicons } from "@expo/vector-icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { Tabs } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MD3LightTheme as DefaultTheme, PaperProvider } from "react-native-paper";

import { AuthProvider } from "../providers/AuthProvider";
import { clientPersister } from "../utils/mmkv";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 24 * 60 * 60 * 1000, // 24 hours
    },
  },
});

persistQueryClient({
  queryClient,
  persister: clientPersister,
});

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <PaperProvider theme={theme}>
            <TabsLayout />
          </PaperProvider>
        </QueryClientProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="(index)"
        options={{
          tabBarLabel: "Home",
          headerShown: false,
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <Ionicons name="home" size={24} color={color} />
            ) : (
              <Ionicons name="home-outline" size={24} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="(explore)"
        options={{
          tabBarLabel: "Explore",
          headerShown: false,
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <Ionicons name="search" size={24} color={color} />
            ) : (
              <Ionicons name="search-outline" size={24} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          tabBarLabel: "Me",
          headerShown: false,
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <Ionicons name="person" size={24} color={color} />
            ) : (
              <Ionicons name="person-outline" size={24} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}
