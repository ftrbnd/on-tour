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
          tabBarIcon: () => <Ionicons name="home" size={24} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          href: "/search",
          tabBarLabel: "Search",
          tabBarIcon: () => <Ionicons name="search" size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: "/profile",
          tabBarLabel: "Me",
          tabBarIcon: () => <Ionicons name="person" size={24} />,
        }}
      />
      <Tabs.Screen name="artist" options={{ href: null }} />
    </Tabs>
  );
}
