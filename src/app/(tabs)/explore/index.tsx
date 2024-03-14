import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Searchbar, Text } from "react-native-paper";
import { useDebouncedCallback } from "use-debounce";

import ArtistPreview from "@/src/components/ArtistPreview";
import ArtistSearchResult from "@/src/components/ArtistSearchResult";
import { useAuth } from "@/src/providers/AuthProvider";
import { getRelatedArtists, getTopArtists, searchForArtists } from "@/src/services/spotify";
import { Artist } from "@/src/utils/spotify-types";

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  list: {
    padding: 8,
  },
});

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Artist[]>([]);

  const { session } = useAuth();
  const router = useRouter();

  const debounced = useDebouncedCallback(async (query) => {
    const results = await searchForArtists(session?.accessToken, query);
    setSearchResults(results);
  }, 1000);

  const { data: topArtists } = useQuery({
    queryKey: ["top-artists"],
    queryFn: () => getTopArtists(session?.accessToken),
    enabled: session !== null && session !== undefined,
  });

  const { data: relatedArtists } = useQuery({
    queryKey: ["related-artists"],
    queryFn: () => getRelatedArtists(session?.accessToken, topArtists ? topArtists[0].id : null),
    enabled: session !== null && session !== undefined && topArtists !== undefined,
  });

  const openArtistPage = (artistId: string) => {
    router.push(`/explore/${artistId}`);
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search for an artist"
        onChangeText={(text) => {
          setSearchQuery(text);
          debounced(text);
        }}
        value={searchQuery}
      />

      {searchResults.length > 0 ? (
        <FlatList
          style={styles.list}
          showsVerticalScrollIndicator={false}
          data={searchResults ?? []}
          renderItem={({ item }) => <ArtistSearchResult artist={item} />}
          keyExtractor={(artist) => artist.id}
        />
      ) : (
        <>
          <Text variant="displayMedium">Explore</Text>
          <FlatList
            style={styles.list}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={relatedArtists ?? []}
            renderItem={({ item }) => (
              <ArtistPreview onPress={() => openArtistPage(item.id)} artist={item} />
            )}
            keyExtractor={(artist) => artist.id}
          />
        </>
      )}
    </View>
  );
}
