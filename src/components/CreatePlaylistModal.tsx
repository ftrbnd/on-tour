import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { openBrowserAsync } from "expo-web-browser";
import moment from "moment";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Modal, Portal, Text, TextInput } from "react-native-paper";

import { useAuth } from "../providers/AuthProvider";
import {
  CreatePlaylistRequestBody,
  createPlaylist,
  UpdatePlaylistRequestBody,
  addSongsToPlaylist,
  getUriFromSetlistFmSong,
  addPlaylistCoverImage,
  UpdatePlaylistImageRequestBody,
} from "../services/spotify";
import { BasicSet, Setlist, Song } from "../utils/setlist-fm-types";
import { Playlist, TrackItem } from "../utils/spotify-types";

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
  setlist?: Setlist;
  primary?: BasicSet | null;
  encore?: BasicSet | null;
  playlistName: string;
}

export default function CreatePlaylistModal({
  visible,
  setVisible,
  setlist,
  primary,
  encore,
  playlistName,
}: ModalProps) {
  const [name, setName] = useState<string | null>(playlistName ?? null);
  const [description, setDescription] = useState<string | null>(
    `${setlist?.venue.name} / ${setlist?.venue.city.name} / ${moment(setlist?.eventDate, "DD-MM-YYYY").format("MMMM D, YYYY")}` ??
      null,
  );
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [createdPlaylist, setCreatedPlaylist] = useState<Playlist<TrackItem> | null>(null);
  const [helperText, setHelperText] = useState<string | null>(null);

  const { session, user } = useAuth();

  // TODO: separate playlist/setlist logic into dedicated hooks
  const createPlaylistMutation = useMutation({
    mutationFn: (body: CreatePlaylistRequestBody) =>
      createPlaylist(session?.accessToken, user?.providerId, body),
    onSuccess: async (createdPlaylist) => {
      console.log("Playlist created!");
      setCreatedPlaylist(createdPlaylist);
      await handleUpdatePlaylist(createdPlaylist);
    },
    onError: (error) => {
      console.error("Create mutation failed", error);
    },
  });

  const updatePlaylistMutation = useMutation({
    mutationFn: (body: UpdatePlaylistRequestBody) =>
      addSongsToPlaylist(session?.accessToken, { playlistId: body.playlistId, uris: body.uris }),
    onSuccess: async (_updatedPlaylist, body) => {
      // TODO: show this message as an alert?
      // TODO: link setlist ids to playlist ids in mmkv or neondb
      // if a user has already created a playlist for this setlist, show a button that can take them to the playlist
      console.log("Playlist tracks updated!");
      setHelperText(`Found ${body.found}/${body.expected} songs`);

      if (selectedImage) {
        await updatePlaylistImageMutation.mutateAsync({
          playlistId: body.playlistId,
          base64: selectedImage.base64,
        });
      } else {
        console.log("Skipped image upload");
      }
    },
    onError: (error) => {
      console.error("Update mutation failed", error);
    },
  });

  const updatePlaylistImageMutation = useMutation({
    mutationFn: (body: UpdatePlaylistImageRequestBody) =>
      addPlaylistCoverImage(session?.accessToken, {
        playlistId: body.playlistId,
        base64: body.base64,
      }),
    onSuccess: (_, body) => {
      console.log("Playlist image updated!");
    },
    onError: (error) => {
      console.error("Playlist image mutation failed", error);
    },
  });

  const mutationsPending =
    createPlaylistMutation.isPending ||
    updatePlaylistMutation.isPending ||
    updatePlaylistImageMutation.isPending;

  const getCurrentOperation = () => {
    if (updatePlaylistImageMutation.isPending) return "Adding cover image...";
    if (updatePlaylistMutation.isPending) return "Adding tracks...";
    if (createPlaylistMutation.isPending) return "Creating playlist...";

    return "Please wait...";
  };

  const handleCreatePlaylist = async () => {
    try {
      if (!user) throw new Error("User must be logged in");

      await createPlaylistMutation.mutateAsync({
        name: playlistName,
        description: description ?? "",
        public: false,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdatePlaylist = async (playlist: Playlist) => {
    try {
      const p = primary?.song ?? [];
      const e = encore?.song ?? [];
      const allSongs = [...p, ...e];

      const uris: string[] = [];

      for (const song of allSongs) {
        const uri = await getSpotifyUri(song);
        if (!uri) continue;

        uris.push(uri);
      }

      await updatePlaylistMutation.mutateAsync({
        playlistId: playlist.id,
        uris,
        expected: allSongs.length,
        found: uris.length,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getSpotifyUri = async (song: Song) => {
    try {
      const artistToSearch = song.cover ? song.cover.name : setlist?.artist.name;

      const uri = await getUriFromSetlistFmSong(session?.accessToken, artistToSearch, song);

      return uri;
    } catch (error) {
      console.error(error);
    }
  };

  const pickImageAsync = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 0.5,
        base64: true,
      });
      console.log("size:", result.assets && result.assets[0].fileSize);
      // TODO: Determine fileSize and get to highest possbile under 256 kb

      if (!result.canceled) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openSpotifyPlaylist = async () => {
    try {
      if (createdPlaylist) await openBrowserAsync(createdPlaylist.external_urls.spotify);
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
          <Text variant="headlineLarge">Playlist Details</Text>
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

        <TextInput
          label="Name"
          value={name ?? ""}
          onChangeText={(text) => setName(text)}
          multiline
        />
        <TextInput
          label="Description"
          value={description ?? ""}
          onChangeText={(text) => setDescription(text)}
          multiline
        />

        <View style={styles.buttons}>
          <Button onPress={pickImageAsync} mode="outlined" disabled={mutationsPending}>
            {selectedImage ? "New image" : "Upload image"}
          </Button>
          <Button
            onPress={handleCreatePlaylist}
            mode="outlined"
            loading={mutationsPending}
            disabled={mutationsPending}>
            {mutationsPending ? getCurrentOperation() : "Create"}
          </Button>
        </View>

        {createdPlaylist && (
          <View style={styles.info}>
            <Text variant="labelMedium">{helperText}</Text>
            <Button onPress={openSpotifyPlaylist}>View your playlist</Button>
          </View>
        )}
      </Modal>
    </Portal>
  );
}
