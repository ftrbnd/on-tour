import { Ionicons, Entypo } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Modal, Portal, Text, TextInput } from "react-native-paper";

import usePlaylist from "../hooks/usePlaylist";

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    display: "flex",
    gap: 12,
    borderRadius: 20,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 75,
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 10,
    backgroundColor: "lightgray",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  info: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
});

interface ModalProps {
  visible: boolean;
  setVisible: (vis: boolean) => void;
  setlistId: string;
}

export default function CreatePlaylistModal({ visible, setVisible, setlistId }: ModalProps) {
  const playlist = usePlaylist(setlistId);

  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [helperText, setHelperText] = useState<string | null>(null);
  const [createDisabled, setCreateDisabled] = useState<boolean>(false);

  const pickImageAsync = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });
      if (!result.assets) return;

      const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri, {
        size: true,
      });
      // TODO: https://docs.expo.dev/versions/latest/sdk/filesystem/#fileinfo
      const fileSize = fileInfo.size;
      if (fileSize >= 256 * 1000) {
        setSelectedImage(null);
        setCreateDisabled(true);
        setHelperText("Image size is too big!");
        return;
      }

      if (!result.canceled) {
        setSelectedImage(result.assets[0]);
        setCreateDisabled(false);
        setHelperText(null);
      }
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
          <Text variant="headlineLarge">
            {playlist.addedTracks ? "Playlist Created!" : "Playlist Details"}
          </Text>
          {selectedImage ? (
            <Image
              source={{
                uri: selectedImage.uri,
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

        {playlist.addedTracks ? (
          <Text variant="labelLarge">{playlist.name}</Text>
        ) : (
          <TextInput
            label="Name"
            value={playlist.name ?? ""}
            onChangeText={(text) => playlist.setName(text)}
            multiline
          />
        )}
        {playlist.addedTracks ? (
          <Text variant="labelMedium">{playlist.description}</Text>
        ) : (
          <TextInput
            label="Description"
            value={playlist.description ?? ""}
            onChangeText={(text) => playlist.setDescription(text)}
            multiline
          />
        )}

        {!playlist.addedTracks && (
          <View style={styles.buttons}>
            <Button onPress={pickImageAsync} mode="outlined" disabled={playlist.mutationsPending}>
              {selectedImage ? "New image" : "Upload image"}
            </Button>
            <Button
              onPress={() => playlist.startMutations(selectedImage)}
              mode="outlined"
              loading={playlist.mutationsPending}
              disabled={playlist.mutationsPending || createDisabled}>
              {playlist.mutationsPending ? playlist.currentOperation : "Create"}
            </Button>
          </View>
        )}

        <View style={styles.info}>
          {helperText && <Text variant="labelMedium">{helperText}</Text>}
          {playlist.addedTracks && (
            <Button
              mode="contained"
              onPress={() => playlist.openWebPage()}
              icon={() => <Entypo name="spotify" size={24} color="black" />}>
              View your playlist
            </Button>
          )}
        </View>
      </Modal>
    </Portal>
  );
}
