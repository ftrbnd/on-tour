import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { randomUUID } from "expo-crypto";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

import SetlistPreview from "@/src/components/SetlistPreview";
import { useAuth } from "@/src/providers/AuthProvider";
import { getRecentShows } from "@/src/services/setlist-fm";
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

  // TODO: decide on how long to keep cache (recentShows does one api request per artist)

  const { data: recentShows } = useQuery({
    queryKey: ["recent-shows"],
    queryFn: () => getRecentShows(data?.topArtists),
    enabled: data?.topArtists !== undefined,
  });

  useEffect(() => {
    if (data?.topArtists) {
      setTopArtists(data.topArtists);
    }
  }, [data?.topArtists]);

  return (
    <>
      <Stack.Screen options={{ title: "On Tour" }} />
      <View style={styles.container}>
        {/* <Text variant="displayMedium">Your Artists</Text>

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
        /> */}

        <Text variant="displayMedium">Recent Shows</Text>

        <FlatList
          style={styles.list}
          data={recentShows}
          renderItem={({ item }) => <SetlistPreview setlist={item} />}
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
