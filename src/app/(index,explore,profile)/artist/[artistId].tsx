import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { randomUUID } from "expo-crypto";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";

import SetlistPreview from "@/src/components/SetlistPreview";
import { useAuth } from "@/src/providers/AuthProvider";
import { searchArtistSetlist } from "@/src/services/setlist-fm";
import { getOneArtist } from "@/src/services/spotify";
import { Setlist } from "@/src/utils/setlist-fm-types";

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  list: {
    padding: 8,
  },
  cover: {
    borderRadius: 0,
  },
});

export default function ArtistPage() {
  const [nextPage, setNextPage] = useState<number>(1);
  const [setlists, setSetlists] = useState<Setlist[]>([]);

  const { artistId }: { artistId: string } = useLocalSearchParams();
  const { session } = useAuth();

  const { data: artist } = useQuery({
    queryKey: ["artist", artistId],
    queryFn: () => getOneArtist(session?.accessToken, artistId),
    enabled: session != null,
  });

  const { data, isPlaceholderData } = useQuery({
    queryKey: ["setlists", artist?.name, nextPage],
    queryFn: () => searchArtistSetlist(artist?.name, nextPage),
    enabled: artist !== undefined,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data?.setlists) {
      setSetlists((prev) => prev.concat(data.setlists));
    }
  }, [data?.setlists]);

  return (
    <View>
      <Stack.Screen options={{ headerTitle: artist?.name }} />

      {artist && <Card.Cover source={{ uri: artist.images[1].url }} style={styles.cover} />}
      <View style={styles.container}>
        <FlatList
          style={styles.list}
          data={setlists}
          renderItem={({ item }) => <SetlistPreview setlist={item} />}
          keyExtractor={(setlist) => `${setlist.id}-${randomUUID()}`}
          onStartReachedThreshold={1}
          onStartReached={() => {
            if (setlists.length <= 5 && !isPlaceholderData && data?.nextPage) {
              setNextPage(data.nextPage);
            }
          }}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (!isPlaceholderData && data?.nextPage) {
              setNextPage(data.nextPage);
            }
          }}
          ListEmptyComponent={<Text>No setlists were found for this artist.</Text>}
          ListFooterComponent={<Text>Looks like there are no more setlists for this artist.</Text>}
        />
      </View>
    </View>
  );
}
