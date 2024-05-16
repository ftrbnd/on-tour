import { useTheme } from "@ui-kitten/components";
import { ActivityIndicator, View, ViewProps } from "react-native";

export default function LoadingIndicator(props?: ViewProps) {
  const theme = useTheme();

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator color={theme["color-primary-default"]} size="small" {...props} />
    </View>
  );
}
