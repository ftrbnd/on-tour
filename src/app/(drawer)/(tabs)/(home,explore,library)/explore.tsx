import { useQuery } from "@tanstack/react-query";
import { Icon, Input, Layout } from "@ui-kitten/components";
import { useMemo, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import ArtistList from "@/src/components/Artist/ArtistList";
import { useAuth } from "@/src/providers/AuthProvider";
import { getRelatedArtists, getTopArtists, searchForArtists } from "@/src/services/spotify";
import { Artist } from "@/src/utils/spotify-types";

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Artist[]>([]);

  const { session } = useAuth();
  const inputRef = useRef<Input>(null);

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

  const exitSearch = () => {
    setSearchQuery("");
    setSearchResults([]);

    inputRef.current?.blur();
  };

  return (
    <Layout level="2" style={{ flex: 1 }}>
      <Input
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          debounced(text);
        }}
        placeholder="Search for an artist"
        status="primary"
        ref={inputRef}
        accessoryLeft={<Icon name="search-outline" />}
        accessoryRight={
          inputRef.current?.isFocused() ? (
            <Icon name="close-outline" onPress={exitSearch} />
          ) : undefined
        }
        style={{ marginTop: 16, marginHorizontal: 16 }}
      />

      <ArtistList
        artists={searchResults.length > 0 ? searchResults : shuffledArtists ?? []}
        showsVerticalScrollIndicator={searchResults.length > 0}
        onRefresh={() => (searchResults.length > 0 ? null : refetch())}
        refreshing={isRefetching}
        isSearchResult={searchResults.length > 0}
      />
    </Layout>
  );
}
