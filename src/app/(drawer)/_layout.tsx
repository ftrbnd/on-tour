import { Drawer } from "expo-router/drawer";

import DrawerHeaderIcon from "@/src/components/ui/DrawerHeaderIcon";

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerTitleAlign: "center",
        headerLeft: () => <DrawerHeaderIcon marginLeft={16} />,
      }}>
      <Drawer.Screen name="(tabs)" options={{ drawerLabel: "On Tour", headerShown: false }} />
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: "Settings",
          title: "Settings",
        }}
      />
    </Drawer>
  );
}
