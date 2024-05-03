import { DrawerContentComponentProps } from "@react-navigation/drawer";
import {
  Drawer as UIKittenDrawer,
  DrawerItem,
  IndexPath,
  TopNavigation,
  Text,
} from "@ui-kitten/components";
import { Drawer } from "expo-router/drawer";

import DrawerHeaderIcon from "@/src/components/ui/DrawerHeaderIcon";

const DrawerContent = ({ navigation, state }: DrawerContentComponentProps) => (
  <UIKittenDrawer
    selectedIndex={new IndexPath(state.index)}
    onSelect={(index) => navigation.navigate(state.routeNames[index.row])}>
    <DrawerItem title="On Tour" />
    <DrawerItem title="Settings" />
  </UIKittenDrawer>
);

export default function DrawerLayout() {
  return (
    <Drawer drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen name="(tabs)" options={{ drawerLabel: "On Tour", headerShown: false }} />
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: "Settings",
          header: () => (
            <TopNavigation
              title={() => <Text category="h6">Settings</Text>}
              accessoryLeft={() => <DrawerHeaderIcon iconOnly />}
              alignment="center"
            />
          ),
        }}
      />
    </Drawer>
  );
}
