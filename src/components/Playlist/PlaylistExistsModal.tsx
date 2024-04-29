import { Entypo } from "@expo/vector-icons";
import { openBrowserAsync } from "expo-web-browser";
import { StyleSheet, View } from "react-native";
import { useMMKVString } from "react-native-mmkv";
import { Button, Modal, Portal, Text, useTheme } from "react-native-paper";

import PlaylistImage from "./PlaylistImage";

interface ModalProps {
  visible: boolean;
  setVisible: (vis: boolean) => void;
  playlistId: string | null;
  playlistTitle: string;
}

export default function PlaylistExistsModal({
  visible,
  setVisible,
  playlistId,
  playlistTitle,
}: ModalProps) {
  const [playlistImage] = useMMKVString(`playlist-${playlistId}-image`);
  const theme = useTheme();

  const openWebPage = async () => {
    try {
      if (playlistId) await openBrowserAsync(`https://open.spotify.com/playlist/${playlistId}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={() => setVisible(false)}
        contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <PlaylistImage showImage={playlistImage !== undefined} uri={playlistImage} />
        </View>

        <Text variant="labelLarge" style={{ fontWeight: "bold", textAlign: "center" }}>
          {playlistTitle}
        </Text>

        <View style={styles.info}>
          <Button
            mode="contained"
            onPress={openWebPage}
            icon={({ color }) => <Entypo name="spotify" size={24} color={color} />}>
            View your playlist
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    padding: 20,
    margin: 20,
    display: "flex",
    gap: 12,
    borderRadius: 20,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 100,
  },
  info: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
});
