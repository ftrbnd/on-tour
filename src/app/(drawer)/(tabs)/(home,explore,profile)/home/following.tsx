import { FlashList } from "@shopify/flash-list";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";

import ArtistPreview from "@/src/components/ArtistPreview";
import { useAuth } from "@/src/providers/AuthProvider";
import { getTopArtists } from "@/src/services/spotify";
import { Artist } from "@/src/utils/spotify-types";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 8,
  },
});

export default function Following() {
  const [next, setNext] = useState<string | null>(null);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);

  const { session } = useAuth();

  const { data, isPlaceholderData } = useQuery({
    queryKey: ["top-artists", next],
    queryFn: () => getTopArtists(session?.accessToken, next),
    enabled: session !== null,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data?.topArtists) {
      setTopArtists((prev) => prev.concat(data.topArtists));
    }
  }, [data?.topArtists]);

  return (
    <View style={styles.container}>
      <FlashList
        estimatedItemSize={75}
        contentContainerStyle={styles.list}
        data={topArtists}
        renderItem={({ item }) => <ArtistPreview artist={item} isSearchResult={false} />}
        onEndReached={() => {
          if (!isPlaceholderData && data?.next) {
            setNext(data.next);
          }
        }}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}
