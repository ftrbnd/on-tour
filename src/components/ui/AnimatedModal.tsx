import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Modal, Portal, useTheme } from "react-native-paper";
import Animated, { SlideInDown, SlideOutUp } from "react-native-reanimated";

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
    <Portal>
      <Modal visible={visible} onDismiss={() => setVisible(false)}>
        <Animated.View
          entering={SlideInDown}
          exiting={SlideOutUp}
          style={[styles.modal, { backgroundColor: theme.colors.background }]}>
          <View style={styles.header}>{header}</View>
          {body && <View style={styles.body}>{body}</View>}
          {footer && <View style={styles.footer}>{footer}</View>}
        </Animated.View>
      </Modal>
    </Portal>
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
