import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { useAuth } from "../providers/AuthProvider";
import { getFollowingArtists } from "../services/spotify";
import { Artist } from "../utils/spotify-types";

export default function useFollowingArtists() {
  const [next, setNext] = useState<string | null>(null);
  const [followingArtists, setFollowingArtists] = useState<Artist[]>([]);

  const { session } = useAuth();

  const { data, isPending, isPlaceholderData, refetch, isRefetching, isLoading } = useQuery({
    queryKey: ["following-artists"],
    queryFn: () => getFollowingArtists(session?.accessToken, next),
    enabled: session !== null,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data?.followingArtists) {
      setFollowingArtists((prev) => prev.concat(data.followingArtists));
    }
  }, [data?.followingArtists]);

  return {
    followingArtists,
    isPending,
    isPlaceholderData,
    next: data?.next,
    setNext,
    refetch,
    isRefetching,
    isLoading,
    type: "following",
  };
}
