import { Button, Layout, Modal, Text } from "@ui-kitten/components";
import { ReactElement } from "react";

export default function InfoDialog({
  visible,
  setVisible,
  title,
  children,
}: {
  visible: boolean;
  setVisible: (vis: boolean) => void;
  title: string;
  children: ReactElement | string;
}) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      onBackdropPress={() => setVisible(false)}
      backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <Layout style={{ padding: 16, gap: 32, borderRadius: 10 }}>
        <Text category="h5">{title}</Text>
        <Layout>
          <Text category="p1">{children}</Text>
        </Layout>
        <Layout>
          <Button
            onPress={() => setVisible(false)}
            style={{ alignSelf: "flex-end", paddingHorizontal: 16 }}>
            OK
          </Button>
        </Layout>
      </Layout>
    </Modal>
  );
}
