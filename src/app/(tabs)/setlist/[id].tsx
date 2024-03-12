import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Button, Text } from "react-native-paper";

import { useAuth } from "@/src/providers/AuthProvider";
import { getOneSetlist } from "@/src/services/setlist-fm";
import { createPlaylist, getCurrentUser } from "@/src/services/spotify";
import { BasicSet } from "@/src/utils/setlist-fm-types";

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  list: {
    padding: 8,
  },
});

interface MutationVars {
  userId: string;
  name: string;
  description?: string;
  public?: boolean;
}

// add button to open setlist on web
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

  const playlistMutation = useMutation({
    mutationFn: (variables: MutationVars) =>
      createPlaylist(session?.accessToken, variables.userId, {
        name: variables.name,
        description: variables.description,
        public: variables.public,
      }),
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

  const handleCreatePlaylist = async () => {
    const currentUser = await getCurrentUser(session?.accessToken);

    await playlistMutation.mutateAsync({
      userId: currentUser.id,
      name: "Sample name",
      description: "sample description",
      public: false,
    });
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
