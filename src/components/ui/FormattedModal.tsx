import { Modal, ModalService, useTheme } from "@ui-kitten/components";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

ModalService.setShouldUseTopInsets = true;

interface Props {
  visible: boolean;
  setVisible: (v: boolean) => void;
  header: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
}

export default function FormattedModal({ visible, setVisible, header, body, footer }: Props) {
  const theme = useTheme();

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onBackdropPress={() => setVisible(false)}
      style={{ width: "95%" }}
      backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <View style={[styles.modal, { backgroundColor: theme["background-basic-color-1"] }]}>
        <View style={styles.header}>{header}</View>
        {body && <View style={styles.body}>{body}</View>}
        {footer && <View style={styles.footer}>{footer}</View>}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    padding: 16,
    margin: 16,
    gap: 16,
    borderRadius: 10,
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
