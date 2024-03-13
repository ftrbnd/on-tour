import { useMutation, useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Button, Text } from "react-native-paper";

import { useAuth } from "@/src/providers/AuthProvider";
import { getOneSetlist } from "@/src/services/setlist-fm";
import {
  CreatePlaylistRequestBody,
  UpdatePlaylistRequestBody,
  addSongsToPlaylist,
  createPlaylist,
  getUriFromSetlistFmSong,
} from "@/src/services/spotify";
import { BasicSet, Song } from "@/src/utils/setlist-fm-types";
import { Playlist } from "@/src/utils/spotify-types";

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  list: {
    padding: 8,
  },
});

// TODO: add button to open setlist on web
export default function SetlistPage() {
  const [primary, setPrimary] = useState<BasicSet | null>(null);
  const [encore, setEncore] = useState<BasicSet | null>(null);

  const { id }: { id: string } = useLocalSearchParams();
  const { session } = useAuth();

  const { data: setlist } = useQuery({
    queryKey: ["setlist", id],
    queryFn: () => getOneSetlist(id),
    enabled: id !== null,
  });

  const createPlaylistMutation = useMutation({
    mutationFn: (body: CreatePlaylistRequestBody) =>
      createPlaylist(session?.accessToken, session?.user?.id, body),
    onSuccess: async (createdPlaylist) => {
      console.log("Created playlist!");
      console.log({ createdPlaylist });

      await handleUpdatePlaylist(createdPlaylist);
    },
    onError: (error) => {
      console.error("Create mutation failed", error);
    },
  });

  const updatePlaylistMutation = useMutation({
    mutationFn: (body: UpdatePlaylistRequestBody) =>
      addSongsToPlaylist(session?.accessToken, { playlistId: body.playlistId, uris: body.uris }),
    onSuccess: (updatedPlaylist, body) => {
      console.log("Updated playlist!");
      console.log({ updatedPlaylist });

      console.log(`Found ${body.found}/${body.expected} songs`);
    },
    onError: (error) => {
      console.error("Update mutation failed", error);
    },
  });

  useEffect(() => {
    if (setlist) {
      setPrimary(setlist.sets.set[0]);
      setEncore(setlist.sets.set[1]);
    }
  }, [setlist]);

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
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: createPlaylistName() }} />
      <Text>Setlist</Text>

      <FlatList
        style={styles.list}
        data={primary?.song}
        renderItem={({ item }) => <Text>{item.name}</Text>}
        keyExtractor={(song) => song.name}
      />

      {encore && (
        <>
          <Text>Encore</Text>
          <FlatList
            style={styles.list}
            data={encore?.song}
            renderItem={({ item }) => <Text>{item.name}</Text>}
            keyExtractor={(song) => song.name}
          />
        </>
      )}

      <Button onPress={handleCreatePlaylist}>Create Playlist</Button>
    </View>
  );
}
