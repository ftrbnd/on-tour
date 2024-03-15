import { useMutation, useQuery } from "@tanstack/react-query";
import { randomUUID } from "expo-crypto";
import { Stack, useLocalSearchParams } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import moment from "moment";
import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import { useMMKVObject } from "react-native-mmkv";
import { Button, Text } from "react-native-paper";

import { useAuth } from "@/src/providers/AuthProvider";
import { getOneSetlist } from "@/src/services/setlist-fm";
import {
  CreatePlaylistRequestBody,
  UpdatePlaylistRequestBody,
  addSongsToPlaylist,
  createPlaylist,
  getOnePlaylist,
  getUriFromSetlistFmSong,
} from "@/src/services/spotify";
import { BasicSet, Song } from "@/src/utils/setlist-fm-types";
import { Playlist, TrackItem } from "@/src/utils/spotify-types";

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  list: {
    padding: 8,
  },
});

export default function SetlistPage() {
  const [primary, setPrimary] = useState<BasicSet | null>(null);
  const [encore, setEncore] = useState<BasicSet | null>(null);

  const { setlistId }: { setlistId: string } = useLocalSearchParams();
  const { session } = useAuth();

  const [createdPlaylist, setCreatedPlaylist] = useState<Playlist<TrackItem> | null>(null);
  const [, setCreatedPlaylists] = useMMKVObject<Playlist<TrackItem>[]>("created.playlists");

  const { data: setlist } = useQuery({
    queryKey: ["setlist", setlistId],
    queryFn: () => getOneSetlist(setlistId),
    enabled: setlistId !== null,
  });

  const createPlaylistMutation = useMutation({
    mutationFn: (body: CreatePlaylistRequestBody) =>
      createPlaylist(session?.accessToken, session?.user?.id, body),
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

  const { data: finalPlaylist } = useQuery({
    queryKey: ["playlist", createdPlaylist?.id],
    queryFn: () => getOnePlaylist(session?.accessToken, createdPlaylist?.id),
    enabled: createdPlaylist !== undefined,
  });

  useEffect(() => {
    if (setlist) {
      setPrimary(setlist.sets.set[0]);
      setEncore(setlist.sets.set[1]);
    }
  }, [setlist]);

  useEffect(() => {
    if (finalPlaylist) {
      setCreatedPlaylists((prev) => (prev ? prev.concat(finalPlaylist) : []));
    }
  }, [finalPlaylist]);

  const createPlaylistName = () => {
    if (!setlist) return "";

    const location = setlist.tour ? setlist.tour.name : setlist.venue.name;

    return `${setlist.artist.name} - ${location}`;
  };

  const handleCreatePlaylist = async () => {
    try {
      if (!session?.user) throw new Error("User must be logged in");

      await createPlaylistMutation.mutateAsync({
        name: createPlaylistName(),
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

  const openSetlistFmPage = async () => {
    try {
      if (setlist) await openBrowserAsync(setlist.url);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: createPlaylistName() }} />
      <Text>Setlist</Text>

      <FlatList
        style={styles.list}
        data={primary?.song}
        renderItem={({ item }) => <Text>{item.name}</Text>}
        keyExtractor={(song) => `${song.name}-${randomUUID()}`}
      />

      {encore && (
        <>
          <Text>Encore</Text>
          <FlatList
            style={styles.list}
            data={encore?.song}
            renderItem={({ item }) => <Text>{item.name}</Text>}
            keyExtractor={(song) => `${song.name}-${randomUUID()}`}
          />
        </>
      )}

      <Button onPress={openSetlistFmPage}>View on setlist.fm</Button>
      <Button onPress={handleCreatePlaylist}>Create Playlist</Button>
    </View>
  );
}
