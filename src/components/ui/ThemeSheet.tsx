import { Divider, Icon, Radio, RadioGroup, Text, Toggle, useTheme } from "@ui-kitten/components";
import { ColorSchemeName, StyleSheet, View, useColorScheme } from "react-native";
import ActionSheet from "react-native-actions-sheet";
import { TouchableOpacity } from "react-native-gesture-handler";

import { usePreferredTheme } from "@/src/providers/ThemeProvider";

export default function ThemeSheet() {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const { toggleTheme, usingSystemTheme } = usePreferredTheme();

  const handleRadioCheck = (value: ColorSchemeName) => {
    toggleTheme(value);
  };

  const handleSwitchToggle = (switchChecked: boolean) => {
    if (switchChecked) toggleTheme(null);
  };

  return (
    <ActionSheet
      gestureEnabled
      containerStyle={{
        ...styles.actionSheet,
        backgroundColor: theme["background-basic-color-1"],
      }}>
      <Text category="h3" style={{ textAlign: "center" }}>
        Theme
      </Text>
      <RadioGroup>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly", padding: 16 }}>
          <TouchableOpacity style={styles.radioButton} onPress={() => handleRadioCheck("light")}>
            <Icon
              name={colorScheme === "light" ? "sun" : "sun-outline"}
              style={{ height: 36, width: 36 }}
              fill={theme["text-basic-color"]}
            />
            <Radio checked={colorScheme === "light"} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.radioButton} onPress={() => handleRadioCheck("dark")}>
            <Icon
              name={colorScheme === "dark" ? "moon" : "moon-outline"}
              style={{ height: 36, width: 36 }}
              fill={theme["text-basic-color"]}
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
          <Icon
            name="smartphone-outline"
            style={{ height: 36, width: 36 }}
            fill={theme["text-basic-color"]}
          />
          <Text category="s1">Device settings</Text>
        </View>
        <Toggle checked={usingSystemTheme} onChange={(val) => handleSwitchToggle(val)} />
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  actionSheet: {
    padding: 16,
    gap: 16,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  radioButton: {
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
});
