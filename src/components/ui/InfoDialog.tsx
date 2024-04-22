import { ReactNode } from "react";
import { Dialog, Portal, Text, Button } from "react-native-paper";

export default function InfoDialog({
  visible,
  setVisible,
  title,
  children,
}: {
  visible: boolean;
  setVisible: (vis: boolean) => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={() => setVisible(false)}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{children}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setVisible(false)}>OK</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
