import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { Drawer as UIKittenDrawer, DrawerItem, IndexPath } from "@ui-kitten/components";
import { Drawer } from "expo-router/drawer";
import { SafeAreaView } from "react-native-safe-area-context";

import DrawerHeaderIcon from "@/src/components/ui/DrawerHeaderIcon";

const DrawerContent = ({ navigation, state }: DrawerContentComponentProps) => (
  <SafeAreaView style={{ flex: 1 }}>
    <UIKittenDrawer
      selectedIndex={new IndexPath(state.index)}
      onSelect={(index) => navigation.navigate(state.routeNames[index.row])}>
      <DrawerItem title="On Tour" />
      <DrawerItem title="Settings" />
    </UIKittenDrawer>
  </SafeAreaView>
);

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <DrawerContent {...props} />}
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
