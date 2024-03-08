import { useQuery } from "@tanstack/react-query";
import { FlatList, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

import ArtistPreview from "@/src/components/ArtistPreview";
import { useAuth } from "@/src/providers/AuthProvider";
import { getTopArtists, getRelatedArtists } from "@/src/services/spotify";

const styles = StyleSheet.create({
  list: {
    padding: 8,
  },
  divider: {
    padding: 0,
    margin: 0,
    borderWidth: 0,
  },
});

export default function Index() {
  const auth = useAuth();

  const { data: topArtists, error } = useQuery({
    queryKey: ["top-artists"],
    queryFn: () => getTopArtists(auth.providerToken),
    enabled: auth.providerToken != null,
  });

  const { data: relatedArtists } = useQuery({
    queryKey: ["related-artists"],
    queryFn: () => getRelatedArtists(auth.providerToken, topArtists ? topArtists[0].id : null),
    enabled: auth.providerToken != null && topArtists !== undefined,
  });

  return (
    <View>
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
