import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Button, Text } from "react-native-paper";

import { useAuth } from "@/src/providers/AuthProvider";
import { getOneSetlist } from "@/src/services/setlist-fm";
import { CreatePlaylistRequestBody, createPlaylist } from "@/src/services/spotify";
import { BasicSet } from "@/src/utils/setlist-fm-types";

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
    onSuccess: () => {
      console.log("Created playlist");

      // TODO: get spotify links for each song in the setlist
      // TODO: add to created playlist
    },
    onError: (error) => {
      console.error("Mutation failed", error);
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

  return (
    <View style={styles.container}>
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
