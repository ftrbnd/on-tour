import { Layout, useTheme } from "@ui-kitten/components";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import ActionSheet from "react-native-actions-sheet";

interface Props {
  header: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
}

export default function FormattedSheet({ header, body, footer }: Props) {
  const theme = useTheme();

  return (
    <ActionSheet
      gestureEnabled
      containerStyle={{ ...styles.sheet, backgroundColor: theme["background-basic-color-1"] }}>
      <Layout style={{ gap: 32 }}>
        <View style={styles.header}>{header}</View>
        {body && <View style={styles.body}>{body}</View>}
        {footer && <View style={styles.footer}>{footer}</View>}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  body: {
    gap: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});
