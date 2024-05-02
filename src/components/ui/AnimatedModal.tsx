import { Modal, useTheme } from "@ui-kitten/components";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

interface Props {
  visible: boolean;
  setVisible: (v: boolean) => void;
  header: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
}

export default function AnimatedModal({ visible, setVisible, header, body, footer }: Props) {
  const theme = useTheme();

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onBackdropPress={() => setVisible(false)}
      backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      style={[styles.modal, { backgroundColor: theme["background-basic-color-2"] }]}>
      <View style={styles.header}>{header}</View>
      {body && <View style={styles.body}>{body}</View>}
      {footer && <View style={styles.footer}>{footer}</View>}
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    gap: 12,
    padding: 20,
    margin: 20,
    borderRadius: 20,
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
