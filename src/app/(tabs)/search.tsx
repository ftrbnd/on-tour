import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Searchbar } from "react-native-paper";
import { useDebouncedCallback } from "use-debounce";

import ArtistSearchResult from "@/src/components/ArtistSearchResult";
import { useAuth } from "@/src/providers/AuthProvider";
import { searchForArtists } from "@/src/services/spotify";
import { Artist } from "@/src/utils/spotify-types";

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  list: {
    padding: 8,
  },
});

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Artist[]>([]);

  const auth = useAuth();

  const debounced = useDebouncedCallback(async (query) => {
    const results = await searchForArtists(auth.providerToken, query);
    setSearchResults(results);
  }, 1000);

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

      <FlatList
        style={styles.list}
        showsVerticalScrollIndicator={false}
        data={searchResults ?? []}
        renderItem={({ item }) => <ArtistSearchResult artist={item} />}
        keyExtractor={(artist) => artist.id}
      />
    </View>
  );
}
