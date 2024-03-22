import { useMutation, useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { useMMKVObject } from "react-native-mmkv";
import { Button, Modal, Portal } from "react-native-paper";

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

      await createPlaylistMutation.mutateAsync({
        name: playlistName,
        description: `${setlist?.venue.name} / ${setlist?.venue.city.name} / ${moment(setlist?.eventDate, "DD-MM-YYYY").format("MMMM D, YYYY")}`,
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

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={() => setVisible(false)}
        contentContainerStyle={styles.modal}>
        <Button onPress={handleCreatePlaylist}>Create playlist</Button>
      </Modal>
    </Portal>
  );
}
