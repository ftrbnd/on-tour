import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Layout } from "@ui-kitten/components";
import { useState, useEffect } from "react";

import ArtistList from "@/src/components/Artist/ArtistList";
import { useAuth } from "@/src/providers/AuthProvider";
import { getTopArtists } from "@/src/services/spotify";
import { Artist } from "@/src/utils/spotify-types";

export default function Following() {
  const [next, setNext] = useState<string | null>(null);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);

  const { session } = useAuth();

  const { data, isPending, isPlaceholderData, refetch, isRefetching } = useQuery({
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
    <Layout level="2" style={{ flex: 1 }}>
      <ArtistList
        artists={topArtists}
        isPending={isPending}
        isPlaceholderData={isPlaceholderData}
        showsVerticalScrollIndicator={false}
        next={data?.next}
        setNext={setNext}
        onRefresh={refetch}
        refreshing={isRefetching}
      />
    </Layout>
  );
}
