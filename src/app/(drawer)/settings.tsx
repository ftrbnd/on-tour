import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar, Card, Divider, Icon, Layout, Text, useTheme } from "@ui-kitten/components";
import * as Application from "expo-application";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Alert, View, useColorScheme } from "react-native";
import { SheetManager } from "react-native-actions-sheet";
import { useToast } from "react-native-toast-notifications";

import SettingsItem from "@/src/components/ui/SettingsItem";
import { useAuth } from "@/src/providers/AuthProvider";
import { usePreferredTheme } from "@/src/providers/ThemeProvider";
import { deleteUserData } from "@/src/services/users";
import { clientPersister } from "@/src/utils/mmkv";

export default function Settings() {
  const { usingSystemTheme } = usePreferredTheme();
  const { session, user, signOut } = useAuth();
  const router = useRouter();
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
      "",
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

  const handleDeactivatePress = async () => {
    Alert.alert(
      "Are you sure you want to deactivate?",
      "This will delete your created playlists, upcoming shows, and all data related to your account from our database.",
      [
        { text: "Cancel", onPress: () => null },
        {
          text: "Deactivate",
          onPress: () => {
            signOut();
            mutateAsync();
          },
        },
      ],
      { cancelable: true, userInterfaceStyle: colorScheme ?? "unspecified" },
    );
  };

  const { mutateAsync } = useMutation({
    mutationFn: async () => deleteUserData(session?.token, user?.id),
    onError: () => {
      toast.show("Failed to delete your data", {
        type: "danger",
      });
    },
    onSuccess: () => {
      toast.show("Successfully deleted user data");
      router.replace("/(auth)/sign-in");
    },
  });

  return (
    <Layout level="2" style={{ flex: 1, justifyContent: "space-between" }}>
      <View style={{ padding: 16, gap: 32 }}>
        {session ? (
          <ProfileCard />
        ) : (
          <Card>
            <View>
              <Text category="s1" appearance="hint" style={{ alignSelf: "center", padding: 16 }}>
                {`On Tour v${Application.nativeApplicationVersion ?? "x.x.x"}`}
              </Text>
            </View>
          </Card>
        )}
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
            <Divider />
            {session && (
              <SettingsItem
                title="Deactivate Account"
                subtitle="Delete all my data"
                icon="close-circle-outline"
                onPress={handleDeactivatePress}
              />
            )}
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
  const { user } = useAuth();
  const theme = useTheme();

  return (
    <Card>
      <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
        {user?.avatar ? (
          <Avatar source={{ uri: user.avatar }} ImageComponent={Image} />
        ) : (
          <Icon
            name="person"
            style={{ height: 24, width: 24, flex: 1 }}
            fill={theme["color-primary-default"]}
          />
        )}

        <Text category="h3" numberOfLines={1} ellipsizeMode="head" style={{ margin: 8 }}>
          {user?.displayName ?? user?.providerId}
        </Text>
        <Text category="c2" appearance="hint" style={{ alignSelf: "center", padding: 16 }}>
          {`On Tour v${Application.nativeApplicationVersion ?? "x.x.x"}`}
        </Text>
      </View>
    </Card>
  );
}
