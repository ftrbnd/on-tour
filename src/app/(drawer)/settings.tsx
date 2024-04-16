import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Appearance,
  ColorSchemeName,
  Platform,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";
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
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const theme = useTheme();

  const [checked, setChecked] = useState<ColorSchemeName>("light");
  const [isDeviceTheme, setIsDeviceTheme] = useState<boolean>(false);

  const handleRadioCheck = (value: ColorSchemeName) => {
    setChecked(value);
    Appearance.setColorScheme(value);

    console.log("TODO: implement persisting theme");
  };

  const handleSwitchToggle = (deviceTheme: boolean) => {
    setIsDeviceTheme(deviceTheme);
    console.log("TODO: implement persisting theme");
  };

  return (
    <TouchableOpacity onPress={() => actionSheetRef.current?.show()}>
      <Card.Title
        title="Theme"
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
              name={checked === "light" ? "sunny" : "sunny-outline"}
              size={36}
              color={
                checked === "light"
                  ? theme.colors.primary
                  : colorScheme === "light"
                    ? "black"
                    : "white"
              }
            />
            <RadioButton status={colorScheme === "light" ? "checked" : "unchecked"} value="light" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.radioButton} onPress={() => handleRadioCheck("dark")}>
            <Ionicons
              name={checked === "dark" ? "moon" : "moon-outline"}
              size={36}
              color={
                checked === "dark"
                  ? theme.colors.primary
                  : colorScheme === "dark"
                    ? "white"
                    : "black"
              }
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
          <Switch value={isDeviceTheme} onValueChange={(val) => handleSwitchToggle(val)} />
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
