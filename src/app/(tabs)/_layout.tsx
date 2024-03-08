import { Tabs } from "expo-router/tabs";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ href: "/", tabBarLabel: "Home" }} />
      <Tabs.Screen name="search" options={{ href: "/search", tabBarLabel: "Search" }} />
      <Tabs.Screen name="profile" options={{ href: "/profile", tabBarLabel: "Me" }} />
    </Tabs>
  );
}
