import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import { StyleSheet, View, useColorScheme } from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Avatar, Button, Card, Text, useTheme } from "react-native-paper";

import { useAuth } from "@/src/providers/AuthProvider";

export default function Settings() {
  return (
    <View style={{ flex: 1, padding: 16, gap: 32 }}>
      <ProfileCard />
      <Card>
        <ThemeSettings />
      </Card>
    </View>
  );
}

function ProfileCard() {
  const { session, user, signIn, signOut, isLoading } = useAuth();

  return (
    <Card>
      <Card.Title
        title={
          <Text variant="headlineMedium" numberOfLines={1} ellipsizeMode="head">
            {user?.displayName ?? user?.providerId}
          </Text>
        }
        titleStyle={{ marginLeft: 8 }}
        left={() =>
          user?.avatar ? (
            <Avatar.Image source={{ uri: user.avatar }} size={50} />
          ) : (
            <Avatar.Icon icon={({ color }) => <Ionicons name="person" size={24} color={color} />} />
          )
        }
        right={() => (
          <Button
            icon={({ color }) => <Ionicons name="log-out-outline" size={24} color={color} />}
            loading={isLoading}
            disabled={isLoading}
            onPress={session ? signOut : signIn}>
            {isLoading ? "Signing out..." : session ? ` Sign out` : "Sign in"}
          </Button>
        )}
      />
    </Card>
  );
}

function ThemeSettings() {
  const colorScheme = useColorScheme();
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={() => actionSheetRef.current?.show()}>
      <Card.Title
        title="Theme"
        subtitle="Change app appearance"
        subtitleStyle={{ color: "gray" }}
        left={() => (
          <Ionicons name={colorScheme === "dark" ? "sunny-outline" : "moon-outline"} size={24} />
        )}
      />

      <ActionSheet
        ref={actionSheetRef}
        snapPoints={[50, 75]}
        containerStyle={{ ...styles.actionSheet, backgroundColor: theme.colors.background }}>
        <Text variant="displaySmall">Theme</Text>
      </ActionSheet>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  actionSheet: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
});
