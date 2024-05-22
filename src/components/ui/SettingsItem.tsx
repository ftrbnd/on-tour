import { Icon, Text, useTheme } from "@ui-kitten/components";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface Props {
  title: string;
  subtitle?: string;
  icon: string;
  onPress: () => void;
}

export default function SettingsItem({ title, subtitle, icon, onPress }: Props) {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Icon fill={theme["color-primary-default"]} name={icon} style={{ height: 30, width: 30 }} />
        <View style={{ marginLeft: 16, gap: 4 }}>
          <Text category="h6">{title}</Text>
          {subtitle && (
            <Text category="s2" appearance="hint">
              {subtitle}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
