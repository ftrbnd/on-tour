import { Picker } from "@react-native-picker/picker";
import { Button, Icon, Input, Text, useTheme } from "@ui-kitten/components";
import moment from "moment";
import { useRef, useState } from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useMMKVString } from "react-native-mmkv";

import PlaylistImage from "./PlaylistImage";
import useImagePicker from "../../hooks/useImagePicker";
import usePlaylist from "../../hooks/usePlaylist";
import useUpcomingShows from "../../hooks/useUpcomingShows";
import { UpcomingShow } from "../../services/upcomingShows";
import AnimatedModal from "../ui/AnimatedModal";
import LoadingIndicator from "../ui/LoadingIndicator";

interface ModalProps {
  visible: boolean;
  setVisible: (vis: boolean) => void;
  setlistId: string;
  isUpcomingShow?: boolean;
}

export default function CreatePlaylistModal({
  visible,
  setVisible,
  setlistId,
  isUpcomingShow,
}: ModalProps) {
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
          <Text category="h2">Playlist Details</Text>
          <PlaylistImage
            showImage={selectedImage !== null || upcomingImageUri !== undefined}
            uri={selectedImage ? selectedImage.uri : upcomingImageUri}
            onPress={() => (playlist.mutationsPending ? null : pickImageAsync())}
          />
        </>
      }
      body={
        <>
          <Input
            label="Name"
            placeholder="Name"
            value={playlist.name ?? ""}
            onChangeText={(text) => playlist.setName(text)}
            multiline
          />
          <Input
            label="Description"
            placeholder="Description"
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
                  onValueChange={(item) => handleSelection(item)}>
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
              {isUpcomingShow && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    borderRadius: 5,
                    padding: 8,
                    backgroundColor: theme["color-info-200"],
                  }}>
                  <Icon
                    name="star"
                    style={{ height: 24, width: 24 }}
                    fill={theme["text-info-color"]}
                  />
                  <Text category="label" style={{ color: theme["text-info-color"] }}>
                    This was one of your upcoming shows!
                  </Text>
                </View>
              )}
            </View>
          )}
        </>
      }
      footer={
        <>
          {warning && <Text category="label">{warning}</Text>}

          {selectedShow && (
            <Button
              appearance="outline"
              onPress={resetModal}
              disabled={playlist.mutationsPending || !playlist.tracksExist || warning !== null}>
              Reset
            </Button>
          )}
          <Button
            appearance="filled"
            onPress={() => playlist.startMutations(selectedImage, { uri: upcomingImageUri })}
            accessoryLeft={playlist.mutationsPending ? LoadingIndicator : undefined}
            disabled={playlist.mutationsPending || !playlist.tracksExist || warning !== null}>
            {playlist.mutationsPending ? playlist.currentOperation : "Create"}
          </Button>
        </>
      }
    />
  );
}
