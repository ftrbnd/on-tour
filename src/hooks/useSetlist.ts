import { useQuery } from "@tanstack/react-query";
import { openBrowserAsync } from "expo-web-browser";
import { useState, useEffect } from "react";

import { useAuth } from "../providers/AuthProvider";
import { getOneSetlist } from "../services/setlist-fm";
import { getMultipleTracks } from "../services/spotify";
import { Song } from "../utils/setlist-fm-types";

export default function useSetlist(id: string) {
  const [songs, setSongs] = useState<Song[] | null>(null);

  const { session } = useAuth();

  const { data: setlist, isLoading } = useQuery({
    queryKey: ["setlist", id],
    queryFn: () => getOneSetlist(id),
    enabled: id !== null,
  });

  const { data: spotifyTracks } = useQuery({
    queryKey: ["spotify-tracks", id],
    queryFn: () => getMultipleTracks(session?.accessToken, [...(songs ?? [])], setlist),
    enabled: session !== null && setlist !== undefined && songs !== null,
  });

  useEffect(() => {
    if (setlist) {
      const songs: Song[] = [];
      for (const set of setlist.sets.set) {
        songs.push(...set.song);
      }
      setSongs(songs);
    }
  }, [setlist]);

  const openWebpage = async () => {
    try {
      if (setlist) await openBrowserAsync(setlist.url);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    data: setlist,
    isLoading,
    songs,
    openWebpage,
    spotifyTracks,
  };
}
