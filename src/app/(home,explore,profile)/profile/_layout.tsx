import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";

export default function ProfileLayout() {
  return (
    <Drawer>
      <Drawer.Screen
        name="index"
        options={{
          drawerIcon: ({ size, color }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: "Settings",
          title: "Settings",
          drawerIcon: ({ size, color }) => <Ionicons name="settings" size={size} color={color} />,
        }}
      />
    </Drawer>
  );
}
