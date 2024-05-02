import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { Searchbar } from "react-native-paper";
import { useDebouncedCallback } from "use-debounce";

import ArtistList from "@/src/components/Artist/ArtistList";
import { useAuth } from "@/src/providers/AuthProvider";
import { getRelatedArtists, getTopArtists, searchForArtists } from "@/src/services/spotify";
import { Artist } from "@/src/utils/spotify-types";

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
    enabled: session !== null,
  });

  const {
    data: relatedArtists,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["related-artists"],
    queryFn: () =>
      getRelatedArtists(
        session?.accessToken,
        data?.topArtists ? data?.topArtists[Math.floor(Math.random() * 10)].id : null,
      ),
    enabled: session !== null && data?.topArtists !== undefined,
  });

  const shuffledArtists = useMemo(
    () => relatedArtists?.sort(() => Math.random() - 0.5),
    [relatedArtists],
  );

  return (
    <View style={{ flex: 1 }}>
      <Searchbar
        style={{ marginTop: 16, marginHorizontal: 16 }}
        placeholder="Search for an artist"
        onChangeText={(text) => {
          setSearchQuery(text);
          debounced(text);
        }}
        value={searchQuery}
      />

      <ArtistList
        artists={searchResults.length > 0 ? searchResults : shuffledArtists ?? []}
        showsVerticalScrollIndicator={searchResults.length > 0}
        onRefresh={() => (searchResults.length > 0 ? null : refetch())}
        refreshing={isRefetching}
        isSearchResult={searchResults.length > 0}
      />
    </View>
  );
}
