import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { useAuth } from "../providers/AuthProvider";
import { getTopArtists } from "../services/spotify";
import { Artist } from "../utils/spotify-types";

export default function useTopArtists() {
  const [next, setNext] = useState<string | null>(null);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);

  const { session } = useAuth();

  const { data, isPending, isPlaceholderData, refetch, isRefetching, isLoading } = useQuery({
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

  return {
    topArtists,
    isPending,
    isPlaceholderData,
    next: data?.next,
    setNext,
    refetch,
    isRefetching,
    isLoading,
    type: "top",
  };
}
