import { Layout, Text, useTheme } from "@ui-kitten/components";
import { StyleSheet } from "react-native";
import ActionSheet, { useSheetPayload } from "react-native-actions-sheet";

export default function InfoSheet() {
  const { title, description } = useSheetPayload("info-sheet");
  const theme = useTheme();

  return (
    <ActionSheet
      gestureEnabled
      containerStyle={{ ...styles.sheet, backgroundColor: theme["background-basic-color-1"] }}>
      <Layout style={{ gap: 32 }}>
        <Text category="h5">{title}</Text>
        <Text category="p1">{description}</Text>
      </Layout>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  sheet: {
    padding: 16,
    gap: 16,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
});
