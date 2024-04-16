import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import { ColorSchemeName, Platform, StyleSheet, View, useColorScheme } from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  Avatar,
  Button,
  Card,
  Divider,
  RadioButton,
  Switch,
  Text,
  useTheme,
} from "react-native-paper";

import { useAuth } from "@/src/providers/AuthProvider";
import { usePreferredTheme } from "@/src/providers/ThemeProvider";

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
        rightStyle={{ marginRight: 8 }}
      />
    </Card>
  );
}

function ThemeSettings() {
  const colorScheme = useColorScheme();
  const { toggleTheme, usingSystemTheme } = usePreferredTheme();
  const theme = useTheme();

  const actionSheetRef = useRef<ActionSheetRef>(null);

  const handleRadioCheck = (value: ColorSchemeName) => {
    toggleTheme(value);
  };

  const handleSwitchToggle = (switchChecked: boolean) => {
    if (switchChecked) toggleTheme(null);
  };

  const capitalizedThemeName = colorScheme?.replace(colorScheme[0], colorScheme[0].toUpperCase());

  return (
    <TouchableOpacity onPress={() => actionSheetRef.current?.show()}>
      <Card.Title
        title={`Theme: ${usingSystemTheme ? "System" : capitalizedThemeName}`}
        subtitle="Change app appearance"
        subtitleStyle={{ color: "gray" }}
        left={() => (
          <Ionicons
            name={colorScheme === "dark" ? "moon-outline" : "sunny-outline"}
            size={24}
            color={theme.colors.primary}
          />
        )}
      />

      <ActionSheet
        ref={actionSheetRef}
        snapPoints={[33, 66]}
        containerStyle={{ ...styles.actionSheet, backgroundColor: theme.colors.background }}>
        <Text variant="headlineSmall" style={{ textAlign: "center" }}>
          Theme
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly", padding: 16 }}>
          <TouchableOpacity style={styles.radioButton} onPress={() => handleRadioCheck("light")}>
            <Ionicons
              name={colorScheme === "light" ? "sunny" : "sunny-outline"}
              size={36}
              color={colorScheme === "light" ? theme.colors.primary : "white"}
            />
            <RadioButton status={colorScheme === "light" ? "checked" : "unchecked"} value="light" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.radioButton} onPress={() => handleRadioCheck("dark")}>
            <Ionicons
              name={colorScheme === "dark" ? "moon" : "moon-outline"}
              size={36}
              color={colorScheme === "dark" ? theme.colors.primary : "black"}
            />
            <RadioButton status={colorScheme === "dark" ? "checked" : "unchecked"} value="dark" />
          </TouchableOpacity>
        </View>

        <Divider bold />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 16,
          }}>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <Ionicons
              name={Platform.OS === "ios" ? "phone-portrait-outline" : "phone-portrait-sharp"}
              size={24}
              color={colorScheme === "dark" ? "white" : "black"}
            />
            <Text variant="labelLarge">Device settings</Text>
          </View>
          <Switch value={usingSystemTheme} onValueChange={(val) => handleSwitchToggle(val)} />
        </View>
      </ActionSheet>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  actionSheet: {
    flex: 1,
    padding: 16,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  radioButton: {
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
});
