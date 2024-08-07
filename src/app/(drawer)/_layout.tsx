import { DrawerContentComponentProps } from "@react-navigation/drawer";
import {
  Drawer as UIKittenDrawer,
  DrawerItem,
  IndexPath,
  TopNavigation,
  Text,
  Icon,
  useTheme,
  Divider,
  Layout,
  Button,
  Avatar,
} from "@ui-kitten/components";
import { Drawer } from "expo-router/drawer";
import { View } from "react-native";

import DrawerHeaderIcon from "@/src/components/ui/DrawerHeaderIcon";
import LoadingIndicator from "@/src/components/ui/LoadingIndicator";
import { useAuth } from "@/src/providers/AuthProvider";

const DrawerContent = ({ navigation, state }: DrawerContentComponentProps) => {
  const theme = useTheme();
  const { session, isLoading, signIn, signOut, user } = useAuth();

  return (
    <UIKittenDrawer
      header={
        <>
          <Layout style={{ padding: 16 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
              <Text category="h3" status="primary">
                On Tour
              </Text>
              {user?.avatar && <Avatar source={{ uri: user.avatar }} size="small" />}
            </View>

            <Text appearance="hint">{user?.displayName ?? user?.providerId}</Text>
          </Layout>
          <Divider />
        </>
      }
      footer={
        <Layout>
          <Button
            appearance="ghost"
            status="basic"
            accessoryRight={
              isLoading ? (
                <LoadingIndicator />
              ) : (
                <Icon
                  name={session ? "log-out-outline" : "log-in-outline"}
                  style={{ height: 24, width: 24 }}
                />
              )
            }
            disabled={isLoading}
            style={{ justifyContent: "space-between" }}
            onPress={session ? signOut : signIn}>
            {session ? "Sign Out" : "Sign In"}
          </Button>
        </Layout>
      }
      selectedIndex={new IndexPath(state.index)}
      onSelect={(index) => navigation.navigate(state.routeNames[index.row])}>
      {session ? (
        <DrawerItem
          title={() => (
            <Text category="h6" style={{ flex: 1, marginLeft: 8 }}>
              Home
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
      ) : (
        <DrawerItem
          title={() => (
            <Text category="h6" style={{ flex: 1, marginLeft: 8 }}>
              Popular
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
      )}
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
  const { session } = useAuth();

  return (
    <Drawer drawerContent={(props) => <DrawerContent {...props} />}>
      {session ? (
        <Drawer.Screen name="(tabs)" options={{ drawerLabel: "On Tour", headerShown: false }} />
      ) : (
        <Drawer.Screen
          name="popular"
          options={{
            drawerLabel: "Popular",
            header: () => (
              <TopNavigation
                title={() => <Text category="h6">On Tour</Text>}
                accessoryLeft={() => <DrawerHeaderIcon iconOnly />}
                alignment="center"
              />
            ),
          }}
        />
      )}
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
