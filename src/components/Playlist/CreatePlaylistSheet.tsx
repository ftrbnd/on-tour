import { Picker } from "@react-native-picker/picker";
import { Button, Icon, Input, Text, useTheme } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import moment from "moment";
import { useRef, useState } from "react";
import { View } from "react-native";
import { SheetManager, useSheetPayload } from "react-native-actions-sheet";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useMMKVString } from "react-native-mmkv";

import PlaylistImage from "./PlaylistImage";
import useImagePicker from "../../hooks/useImagePicker";
import usePlaylist from "../../hooks/usePlaylist";
import useUpcomingShows from "../../hooks/useUpcomingShows";
import { UpcomingShow } from "../../services/upcomingShows";
import FormattedSheet from "../ui/FormattedSheet";
import LoadingIndicator from "../ui/LoadingIndicator";

export default function CreatePlaylistSheet() {
  const { setlistId, upcomingShowId } = useSheetPayload("create-playlist-sheet");
  const playlist = usePlaylist(setlistId);
  const { selectedImage, setSelectedImage, pickImageAsync, warning } = useImagePicker();
  const theme = useTheme();

  const router = useRouter();

  const { upcomingShows, deleteShow } = useUpcomingShows();
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

  const handlePress = async () => {
    try {
      await playlist.startMutations(selectedImage, { uri: upcomingImageUri });

      const showToDelete = upcomingShows.find((show) => show.id === upcomingShowId) ?? selectedShow;
      if (showToDelete) await deleteShow(showToDelete);

      await SheetManager.hide("create-playlist-sheet");
      router.replace("/(drawer)/(tabs)/(library)/createdPlaylists");
    } catch (e) {
      console.error(e);
    }
  };

  const reset = () => {
    playlist.setDefaults();
    setSelectedShow(null);
    setSelectedImage(null);
  };

  return (
    <FormattedSheet
      header={
        <>
          <Text category="h2">Playlist Details</Text>
          <PlaylistImage
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
                  onValueChange={(item) => handleSelection(item)}
                  dropdownIconColor={theme["text-basic-color"]}
                  numberOfLines={1}
                  mode="dropdown"
                  style={{ backgroundColor: theme["background-basic-color-2"] }}>
                  <Picker.Item
                    label="Import an upcoming show"
                    enabled={false}
                    style={{
                      color: theme["text-hint-color"],
                      backgroundColor: theme["background-basic-color-2"],
                    }}
                  />
                  {upcomingShows.map((show) => (
                    <Picker.Item
                      key={show.id}
                      label={`${show.artist} - ${show.tour}`}
                      value={show}
                      style={{
                        color: theme["text-basic-color"],
                        backgroundColor: theme["background-basic-color-2"],
                      }}
                    />
                  ))}
                </Picker>
              </TouchableOpacity>
              {upcomingShowId && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 8,
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
              onPress={reset}
              disabled={playlist.mutationsPending || !playlist.tracksExist || warning !== null}>
              Reset
            </Button>
          )}
          <Button
            appearance="filled"
            onPress={handlePress}
            accessoryLeft={
              playlist.mutationsPending || !playlist.tracksExist ? LoadingIndicator : undefined
            }
            disabled={playlist.mutationsPending || !playlist.tracksExist || warning !== null}>
            {playlist.mutationsPending ? playlist.currentOperation : "Create"}
          </Button>
        </>
      }
    />
  );
}
