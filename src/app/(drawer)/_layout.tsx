import { DrawerContentComponentProps } from "@react-navigation/drawer";
import {
  Drawer as UIKittenDrawer,
  DrawerItem,
  IndexPath,
  TopNavigation,
  Text,
  Icon,
  useTheme,
} from "@ui-kitten/components";
import { Drawer } from "expo-router/drawer";

import DrawerHeaderIcon from "@/src/components/ui/DrawerHeaderIcon";

const DrawerContent = ({ navigation, state }: DrawerContentComponentProps) => {
  const theme = useTheme();

  return (
    <UIKittenDrawer
      selectedIndex={new IndexPath(state.index)}
      onSelect={(index) => navigation.navigate(state.routeNames[index.row])}>
      <DrawerItem
        title={() => (
          <Text category="h6" style={{ flex: 1, marginLeft: 8 }}>
            On Tour
          </Text>
        )}
        accessoryLeft={() => (
          <Icon
            name="home-outline"
            fill={theme["text-basic-color"]}
            style={{ height: 18, width: 18, marginLeft: 8 }}
          />
        )}
      />
      <DrawerItem
        title={() => (
          <Text category="h6" style={{ flex: 1, marginLeft: 8 }}>
            Settings
          </Text>
        )}
        accessoryLeft={() => (
          <Icon
            name="settings-outline"
            fill={theme["text-basic-color"]}
            style={{ height: 18, width: 18, marginLeft: 8 }}
          />
        )}
      />
    </UIKittenDrawer>
  );
};

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
