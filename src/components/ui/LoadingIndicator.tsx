import { Spinner, SpinnerProps } from "@ui-kitten/components";
import { View } from "react-native";

export default function LoadingIndicator(props?: SpinnerProps) {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Spinner size="small" status="basic" {...props} />
    </View>
  );
}
