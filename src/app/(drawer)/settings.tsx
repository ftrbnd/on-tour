import { useQueryClient } from "@tanstack/react-query";
import { Avatar, Button, Card, Divider, Icon, Layout, Text } from "@ui-kitten/components";
import { Image } from "expo-image";
import { Alert, View, useColorScheme } from "react-native";
import { SheetManager } from "react-native-actions-sheet";
import { useToast } from "react-native-toast-notifications";

import LoadingIndicator from "@/src/components/ui/LoadingIndicator";
import SettingsItem from "@/src/components/ui/SettingsItem";
import { useAuth } from "@/src/providers/AuthProvider";
import { usePreferredTheme } from "@/src/providers/ThemeProvider";
import { clientPersister } from "@/src/utils/mmkv";

export default function Settings() {
  const { usingSystemTheme } = usePreferredTheme();
  const colorScheme = useColorScheme();
  const queryClient = useQueryClient();
  const toast = useToast();

  const capitalizedThemeName = colorScheme?.replace(colorScheme[0], colorScheme[0].toUpperCase());

  const handleThemePress = () => {
    SheetManager.show("theme-sheet");
  };

  const handleCachePress = () => {
    Alert.alert(
      "Are you sure you want to clear the cache?",
      ``,
      [
        { text: "Cancel", onPress: () => null },
        { text: "Clear", onPress: clearCache },
      ],
      { cancelable: true, userInterfaceStyle: colorScheme ?? "unspecified" },
    );
  };

  const clearCache = async () => {
    await clientPersister.removeClient();

    await queryClient.invalidateQueries({ refetchType: "none" });
    queryClient.clear();

    toast.show("Cleared the cache");
  };

  return (
    <Layout level="2" style={{ flex: 1, justifyContent: "space-between" }}>
      <View style={{ padding: 16, gap: 32 }}>
        <ProfileCard />
        <Card disabled>
          <View style={{ gap: 16 }}>
            <SettingsItem
              title={`Theme: ${usingSystemTheme ? "System" : capitalizedThemeName}`}
              subtitle="Change app appearance"
              icon={colorScheme === "dark" ? "moon-outline" : "sun-outline"}
              onPress={handleThemePress}
            />
            <Divider />
            <SettingsItem
              title="Cache"
              subtitle="Clear the app's storage"
              icon="trash-outline"
              onPress={handleCachePress}
            />
          </View>
        </Card>
      </View>

      <Text category="c2" appearance="hint" style={{ alignSelf: "center", padding: 16 }}>
        © {new Date().getFullYear()} giosalad
      </Text>
    </Layout>
  );
}

function ProfileCard() {
  const { session, user, signIn, signOut, isLoading } = useAuth();

  return (
    <Card>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        {user?.avatar ? (
          <Avatar source={{ uri: user.avatar }} ImageComponent={Image} />
        ) : (
          <Icon name="person" style={{ height: 24, width: 24, flex: 1 }} />
        )}
        <Text category="h3" numberOfLines={1} ellipsizeMode="head" style={{ margin: 8 }}>
          {user?.displayName ?? user?.providerId}
        </Text>
        <Button
          appearance="ghost"
          status="primary"
          accessoryLeft={
            isLoading ? (
              <LoadingIndicator />
            ) : (
              <Icon name="log-out-outline" style={{ height: 24, width: 24 }} />
            )
          }
          disabled={isLoading}
          onPress={session ? signOut : signIn}>
          {isLoading ? "Signing out..." : session ? "Sign out" : "Sign in"}
        </Button>
      </View>
    </Card>
  );
}
