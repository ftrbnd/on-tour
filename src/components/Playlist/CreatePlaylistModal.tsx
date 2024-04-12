import { Ionicons, Entypo } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Image } from "expo-image";
import moment from "moment";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useMMKVString } from "react-native-mmkv";
import { Button, Modal, Portal, Text, TextInput } from "react-native-paper";

import useImagePicker from "../../hooks/useImagePicker";
import usePlaylist from "../../hooks/usePlaylist";
import useUpcomingShows from "../../hooks/useUpcomingShows";
import { UpcomingShow } from "../../services/upcomingShows";

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
  pickerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
  },
  bottom: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});

interface ModalProps {
  visible: boolean;
  setVisible: (vis: boolean) => void;
  setlistId: string;
}

export default function CreatePlaylistModal({ visible, setVisible, setlistId }: ModalProps) {
  const playlist = usePlaylist(setlistId);
  const { selectedImage, setSelectedImage, pickImageAsync, warning } = useImagePicker();

  const { upcomingShows } = useUpcomingShows();
  const [selectedShow, setSelectedShow] = useState<UpcomingShow | null>(null);
  const [upcomingImageUri] = useMMKVString(`upcoming-show-${selectedShow?.id}-image`);

  const handleSelection = async (show: UpcomingShow | null) => {
    setSelectedShow(show);
    playlist.setName(`${show?.artist} - ${show?.tour}`);
    playlist.setDescription(
      `${show?.venue} / ${show?.city} / ${moment(show?.date, "YYYY-MM-DD").format("MMMM D, YYYY")}`,
    );
  };

  const resetModal = () => {
    playlist.setDefaults();
    setSelectedShow(null);
    setSelectedImage(null);
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
          {selectedImage || upcomingImageUri ? (
            <Image
              source={{
                uri: selectedImage ? selectedImage.uri : upcomingImageUri,
                width: styles.image.width,
                height: styles.image.height,
              }}
              onTouchStart={() => (playlist.mutationsPending ? null : pickImageAsync())}
              contentFit="cover"
              style={styles.image}
              transition={1000}
            />
          ) : (
            <View
              style={styles.image}
              onTouchStart={() => (playlist.mutationsPending ? null : pickImageAsync())}>
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
          <View>
            {upcomingShows.length > 0 && (
              <View style={styles.pickerContainer}>
                <Text style={{ alignSelf: "center" }}>OR</Text>
                <Picker
                  selectedValue={selectedShow}
                  onValueChange={(item) => handleSelection(item)}>
                  <Picker.Item label="Import an upcoming show" enabled={false} />
                  {upcomingShows.map((show) => (
                    <Picker.Item
                      key={show.id}
                      label={`${show.artist} - ${show.tour}`}
                      value={show}
                    />
                  ))}
                </Picker>
              </View>
            )}
          </View>
        )}

        <View style={styles.bottom}>
          {warning && <Text variant="labelMedium">{warning}</Text>}

          {playlist.addedTracks ? (
            <Button
              mode="contained"
              onPress={() => playlist.openWebPage()}
              icon={() => <Entypo name="spotify" size={24} color="black" />}>
              View your playlist
            </Button>
          ) : (
            <>
              {selectedShow && (
                <Button
                  onPress={resetModal}
                  disabled={playlist.mutationsPending || !playlist.tracksExist || warning !== null}>
                  Reset
                </Button>
              )}
              <Button
                onPress={() => playlist.startMutations(selectedImage, { uri: upcomingImageUri })}
                mode="outlined"
                loading={playlist.mutationsPending}
                disabled={playlist.mutationsPending || !playlist.tracksExist || warning !== null}>
                {playlist.mutationsPending ? playlist.currentOperation : "Create"}
              </Button>
            </>
          )}
        </View>
      </Modal>
    </Portal>
  );
}
