import { Tabs } from "expo-router/tabs";

export default function TabLayout() {
  return (
    <Tabs initialRouteName="index">
      <Tabs.Screen name="index" options={{ href: "/" }} />
      <Tabs.Screen name="nearby" options={{ href: "/nearby" }} />
      <Tabs.Screen name="profile" options={{ href: "/profile" }} />
    </Tabs>
  );
}
