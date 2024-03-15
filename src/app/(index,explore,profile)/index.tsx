import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { randomUUID } from "expo-crypto";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

import ArtistPreview from "@/src/components/ArtistPreview";
import { useAuth } from "@/src/providers/AuthProvider";
import { getTopArtists } from "@/src/services/spotify";
import { Artist } from "@/src/utils/spotify-types";

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  list: {
    padding: 8,
  },
});

export default function Home() {
  const [next, setNext] = useState<string | null>(null);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);

  const { session } = useAuth();

  const { data, isPlaceholderData } = useQuery({
    queryKey: ["top-artists", next],
    queryFn: () => getTopArtists(session?.accessToken, next),
    enabled: session !== null && session !== undefined,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data?.topArtists) {
      setTopArtists((prev) => prev.concat(data.topArtists));
    }
  }, [data?.topArtists]);

  return (
    <>
      <Stack.Screen options={{ title: "On Tour" }} />
      <View style={styles.container}>
        <Text variant="displayMedium">Your Artists</Text>

        <FlatList
          style={styles.list}
          data={topArtists}
          renderItem={({ item }) => <ArtistPreview artist={item} />}
          keyExtractor={(artist) => `${artist.id}-${randomUUID()}`}
          onEndReached={() => {
            if (!isPlaceholderData && data?.next) {
              setNext(data.next);
            }
          }}
          onEndReachedThreshold={0.5}
        />
      </View>
    </>
  );
}
