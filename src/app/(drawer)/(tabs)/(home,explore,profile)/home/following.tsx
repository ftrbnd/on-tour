import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { View } from "react-native";

import ArtistList from "@/src/components/Artist/ArtistList";
import { useAuth } from "@/src/providers/AuthProvider";
import { getTopArtists } from "@/src/services/spotify";
import { Artist } from "@/src/utils/spotify-types";

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
    <View style={{ flex: 1 }}>
      <ArtistList
        artists={topArtists}
        isPlaceholderData={isPlaceholderData}
        next={data?.next}
        setNext={setNext}
      />
    </View>
  );
}
