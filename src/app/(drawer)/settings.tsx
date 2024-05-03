import {
  Avatar,
  Button,
  Card,
  Divider,
  Icon,
  Layout,
  Radio,
  RadioGroup,
  Text,
  Toggle,
} from "@ui-kitten/components";
import { Image } from "expo-image";
import { useRef } from "react";
import { ColorSchemeName, StyleSheet, View, useColorScheme } from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { TouchableOpacity } from "react-native-gesture-handler";

import LoadingIndicator from "@/src/components/ui/LoadingIndicator";
import { useAuth } from "@/src/providers/AuthProvider";
import { usePreferredTheme } from "@/src/providers/ThemeProvider";

export default function Settings() {
  return (
    <Layout level="2" style={{ flex: 1, padding: 16, gap: 32 }}>
      <ProfileCard />
      <Card>
        <ThemeSettings />
      </Card>
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
          accessoryLeft={
            isLoading ? (
              <LoadingIndicator status="primary" />
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

function ThemeSettings() {
  const colorScheme = useColorScheme();
  const { toggleTheme, usingSystemTheme } = usePreferredTheme();

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
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Icon
          name={colorScheme === "dark" ? "moon-outline" : "sun-outline"}
          style={{ height: 36, width: 36 }}
        />
        <View style={{ marginLeft: 8, gap: 4 }}>
          <Text category="h6">{`Theme: ${usingSystemTheme ? "System" : capitalizedThemeName}`}</Text>
          <Text category="s2">Change app appearance</Text>
        </View>
      </View>

      <ActionSheet ref={actionSheetRef} snapPoints={[33, 66]} containerStyle={styles.actionSheet}>
        <Text category="h3" style={{ textAlign: "center" }}>
          Theme
        </Text>
        <RadioGroup>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", padding: 16 }}>
            <TouchableOpacity style={styles.radioButton} onPress={() => handleRadioCheck("light")}>
              <Icon
                name={colorScheme === "light" ? "sun" : "sun-outline"}
                style={{ height: 36, width: 36 }}
              />
              <Radio checked={colorScheme === "light"} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.radioButton} onPress={() => handleRadioCheck("dark")}>
              <Icon
                name={colorScheme === "dark" ? "moon" : "moon-outline"}
                style={{ height: 36, width: 36 }}
              />
              <Radio checked={colorScheme === "dark"} />
            </TouchableOpacity>
          </View>
        </RadioGroup>

        <Divider />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 16,
          }}>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <Icon name="smartphone-outline" style={{ height: 36, width: 36 }} />
            <Text category="s1">Device settings</Text>
          </View>
          <Toggle checked={usingSystemTheme} onChange={(val) => handleSwitchToggle(val)} />
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
