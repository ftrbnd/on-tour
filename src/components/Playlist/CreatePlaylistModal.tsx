import { Picker } from "@react-native-picker/picker";
import moment from "moment";
import { useRef, useState } from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useMMKVString } from "react-native-mmkv";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

import PlaylistImage from "./PlaylistImage";
import useImagePicker from "../../hooks/useImagePicker";
import usePlaylist from "../../hooks/usePlaylist";
import useUpcomingShows from "../../hooks/useUpcomingShows";
import { UpcomingShow } from "../../services/upcomingShows";
import AnimatedModal from "../ui/AnimatedModal";

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
    <AnimatedModal
      visible={visible}
      setVisible={setVisible}
      header={
        <>
          <Text variant="headlineLarge">Playlist Details</Text>
          <PlaylistImage
            showImage={selectedImage !== null || upcomingImageUri !== undefined}
            uri={selectedImage ? selectedImage.uri : upcomingImageUri}
            onPress={() => (playlist.mutationsPending ? null : pickImageAsync())}
          />
        </>
      }
      body={
        <>
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
            <View style={{ display: "flex", justifyContent: "center", alignItems: "stretch" }}>
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
                    <Picker.Item
                      key={show.id}
                      label={`${show.artist} - ${show.tour}`}
                      value={show}
                    />
                  ))}
                </Picker>
              </TouchableOpacity>
            </View>
          )}
        </>
      }
      footer={
        <>
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
        </>
      }
    />
  );
}
