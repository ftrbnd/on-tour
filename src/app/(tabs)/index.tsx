import { useQuery } from "@tanstack/react-query";
import { FlatList, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

import ArtistPreview from "@/src/components/ArtistPreview";
import { useAuth } from "@/src/providers/AuthProvider";
import { getTopArtists, getRelatedArtists } from "@/src/services/spotify";

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  list: {
    padding: 8,
  },
});

export default function Index() {
  const { session } = useAuth();

  const { data: topArtists, error } = useQuery({
    queryKey: ["top-artists"],
    queryFn: () => getTopArtists(session?.accessToken),
    enabled: session !== null && session !== undefined,
  });

  const { data: relatedArtists } = useQuery({
    queryKey: ["related-artists"],
    queryFn: () => getRelatedArtists(session?.accessToken, topArtists ? topArtists[0].id : null),
    enabled: session !== null && session !== undefined && topArtists !== undefined,
  });

  return (
    <View style={styles.container}>
      {error && <Text>{error.message}</Text>}

      <Text variant="displayMedium">Your Artists</Text>
      <FlatList
        style={styles.list}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={topArtists ?? []}
        renderItem={({ item }) => <ArtistPreview artist={item} />}
        keyExtractor={(artist) => artist.id}
      />

      <Text variant="displayMedium">Explore</Text>
      <FlatList
        style={styles.list}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={relatedArtists ?? []}
        renderItem={({ item }) => <ArtistPreview artist={item} />}
        keyExtractor={(artist) => artist.id}
      />
    </View>
  );
}
