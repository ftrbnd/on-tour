import { useQuery } from "@tanstack/react-query";
import { randomUUID } from "expo-crypto";
import { Stack } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Searchbar } from "react-native-paper";
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

  const debounced = useDebouncedCallback(async (query) => {
    const results = await searchForArtists(session?.accessToken, query);
    setSearchResults(results);
  }, 1000);

  const { data } = useQuery({
    queryKey: ["top-artists"],
    queryFn: () => getTopArtists(session?.accessToken),
    enabled: session !== null && session !== undefined,
  });

  const { data: relatedArtists } = useQuery({
    queryKey: ["related-artists"],
    queryFn: () =>
      getRelatedArtists(session?.accessToken, data?.topArtists ? data?.topArtists[0].id : null),
    enabled: session !== null && session !== undefined && data?.topArtists !== undefined,
  });

  return (
    <>
      <Stack.Screen options={{ headerTitle: "Explore" }} />
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
          <FlatList
            style={styles.list}
            data={relatedArtists ?? []}
            renderItem={({ item }) => <ArtistPreview artist={item} />}
            keyExtractor={(artist) => `${artist.id}-${randomUUID()}`}
          />
        )}
      </View>
    </>
  );
}
