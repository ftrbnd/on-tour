import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import moment from "moment";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { useMMKVObject } from "react-native-mmkv";
import { Button, Modal, Portal, Text, TextInput } from "react-native-paper";

import { useAuth } from "../providers/AuthProvider";
import {
  CreatePlaylistRequestBody,
  createPlaylist,
  UpdatePlaylistRequestBody,
  addSongsToPlaylist,
  getUriFromSetlistFmSong,
  getOnePlaylist,
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
  const { session, user } = useAuth();

  const [createdPlaylist, setCreatedPlaylist] = useState<Playlist<TrackItem> | null>(null);

  const [name, setName] = useState<string | null>(playlistName ?? null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(
    `${setlist?.venue.name} / ${setlist?.venue.city.name} / ${moment(setlist?.eventDate, "DD-MM-YYYY").format("MMMM D, YYYY")}` ??
      null,
  );

  const [, setCreatedPlaylists] = useMMKVObject<Playlist<TrackItem>[]>("created.playlists");

  const { data: finalPlaylist } = useQuery({
    queryKey: ["playlist", createdPlaylist?.id],
    queryFn: () => getOnePlaylist(session?.accessToken, createdPlaylist?.id),
    enabled: createdPlaylist !== undefined && createdPlaylist !== null,
  });

  const createPlaylistMutation = useMutation({
    mutationFn: (body: CreatePlaylistRequestBody) =>
      createPlaylist(session?.accessToken, user?.providerId, body),
    onSuccess: async (createdPlaylist) => {
      await handleUpdatePlaylist(createdPlaylist);
    },
    onError: (error) => {
      console.error("Create mutation failed", error);
    },
  });

  const updatePlaylistMutation = useMutation({
    mutationFn: (body: UpdatePlaylistRequestBody) =>
      addSongsToPlaylist(session?.accessToken, { playlistId: body.playlistId, uris: body.uris }),
    onSuccess: (_updatedPlaylist, body) => {
      // TODO: show this message as an alert?
      // TODO: link setlist ids to playlist ids in storage
      // if a user has already created a playlist for this setlist, show a button that can take them to the playlist
      Alert.alert("Playlist created!", `Found ${body.found}/${body.expected} songs`);
    },
    onError: (error) => {
      console.error("Update mutation failed", error);
    },
  });

  useEffect(() => {
    if (finalPlaylist) {
      setCreatedPlaylists((prev) => (prev ? prev.concat(finalPlaylist) : []));
    }
  }, [finalPlaylist]);

  const handleCreatePlaylist = async () => {
    try {
      if (!user) throw new Error("User must be logged in");
      setVisible(false);

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

      setCreatedPlaylist(playlist);
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
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log("got an image!", result);
      setSelectedImage(result.assets[0].uri);
    } else {
      console.log("No image selected");
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
                uri: selectedImage,
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
          <Button onPress={pickImageAsync} mode="outlined">
            Upload image
          </Button>
          <Button onPress={handleCreatePlaylist} mode="outlined">
            Create
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}
