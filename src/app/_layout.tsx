import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import Providers from "../providers";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    InterVariable: require("../assets/fonts/InterVariable.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <Providers>
      <TabsLayout />
    </Providers>
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
