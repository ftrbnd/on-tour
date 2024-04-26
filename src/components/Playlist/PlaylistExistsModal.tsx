import { Entypo, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { openBrowserAsync } from "expo-web-browser";
import { StyleSheet, View } from "react-native";
import { useMMKVString } from "react-native-mmkv";
import { Button, Modal, Portal, Text } from "react-native-paper";

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
        contentContainerStyle={styles.modal}>
        <View style={styles.header}>
          {playlistImage ? (
            <Image
              source={{
                uri: playlistImage,
                width: styles.image.width,
                height: styles.image.height,
              }}
              contentFit="cover"
              style={styles.image}
              transition={1000}
            />
          ) : (
            <View style={styles.image}>
              <Ionicons name="musical-notes" size={styles.image.height * 0.66} color="black" />
            </View>
          )}
        </View>

        <Text variant="labelLarge" style={{ fontWeight: "bold" }}>
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
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    display: "flex",
    alignItems: "center",
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
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: "lightgray",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
});
