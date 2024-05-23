import { useTheme } from "@ui-kitten/components";
import { ActivityIndicator, View, ViewProps } from "react-native";

interface Props extends ViewProps {
  color?: string;
}

export default function LoadingIndicator(props?: Props) {
  const theme = useTheme();

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator color={theme["color-primary-default"]} size="small" {...props} />
    </View>
  );
}
