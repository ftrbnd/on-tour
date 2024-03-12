import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router/tabs";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          href: "/",
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="home" size={24} color="black" />
            ) : (
              <Ionicons name="home-outline" size={24} color="black" />
            ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          href: "/search",
          tabBarLabel: "Search",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="search" size={24} color="black" />
            ) : (
              <Ionicons name="search-outline" size={24} color="black" />
            ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: "/profile",
          tabBarLabel: "Me",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="person" size={24} color="black" />
            ) : (
              <Ionicons name="person-outline" size={24} color="black" />
            ),
        }}
      />
      <Tabs.Screen name="artist" options={{ href: null }} />
      <Tabs.Screen name="setlist" options={{ href: null }} />
    </Tabs>
  );
}
