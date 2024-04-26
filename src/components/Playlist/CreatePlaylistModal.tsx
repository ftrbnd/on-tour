import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Image } from "expo-image";
import moment from "moment";
import { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useMMKVString } from "react-native-mmkv";
import { Button, Modal, Portal, Text, TextInput, useTheme } from "react-native-paper";

import useImagePicker from "../../hooks/useImagePicker";
import usePlaylist from "../../hooks/usePlaylist";
import useUpcomingShows from "../../hooks/useUpcomingShows";
import { UpcomingShow } from "../../services/upcomingShows";

interface ModalProps {
  visible: boolean;
  setVisible: (vis: boolean) => void;
  setlistId: string;
}

export default function CreatePlaylistModal({ visible, setVisible, setlistId }: ModalProps) {
  const playlist = usePlaylist(setlistId);
  const { selectedImage, setSelectedImage, pickImageAsync, warning } = useImagePicker();
  const theme = useTheme();

  const { upcomingShows } = useUpcomingShows();
  const [selectedShow, setSelectedShow] = useState<UpcomingShow | null>(null);
  const [upcomingImageUri] = useMMKVString(`upcoming-show-${selectedShow?.id}-image`);

  const pickerRef = useRef<Picker<UpcomingShow | null>>(null);

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
        contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <Text variant="headlineLarge">Playlist Details</Text>
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
            <TouchableOpacity
              onPress={() => (playlist.mutationsPending ? null : pickImageAsync())}
              style={[styles.image, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Ionicons
                name="musical-notes"
                size={styles.image.height * 0.66}
                color={theme.colors.secondary}
              />
            </TouchableOpacity>
          )}
        </View>

        <TextInput
          label="Name"
          value={playlist.name ?? ""}
          onChangeText={(text) => playlist.setName(text)}
          multiline
        />
        <TextInput
          label="Description"
          value={playlist.description ?? ""}
          onChangeText={(text) => playlist.setDescription(text)}
          multiline
        />

        {upcomingShows.length > 0 && (
          <View style={styles.pickerContainer}>
            <Text style={{ alignSelf: "center", marginBottom: 8 }}>OR</Text>
            <TouchableOpacity onPress={() => pickerRef.current?.focus()}>
              <Picker
                ref={pickerRef}
                selectedValue={selectedShow}
                onValueChange={(item) => handleSelection(item)}
                style={{
                  color: theme.colors.onBackground,
                  backgroundColor: theme.colors.background,
                }}>
                <Picker.Item
                  label="Import an upcoming show"
                  enabled={false}
                  style={{ color: "gray" }}
                />
                {upcomingShows.map((show) => (
                  <Picker.Item key={show.id} label={`${show.artist} - ${show.tour}`} value={show} />
                ))}
              </Picker>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.bottom}>
          {warning && <Text variant="labelMedium">{warning}</Text>}

          {selectedShow && (
            <Button
              onPress={resetModal}
              disabled={playlist.mutationsPending || !playlist.tracksExist || warning !== null}>
              Reset
            </Button>
          )}
          <Button
            onPress={() => playlist.startMutations(selectedImage, { uri: upcomingImageUri })}
            mode="contained"
            loading={playlist.mutationsPending}
            disabled={playlist.mutationsPending || !playlist.tracksExist || warning !== null}>
            {playlist.mutationsPending ? playlist.currentOperation : "Create"}
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
