import { useQuery } from "@tanstack/react-query";
import { openBrowserAsync } from "expo-web-browser";

import { useAuth } from "../providers/AuthProvider";
import { getOneSetlist } from "../services/setlist-fm";
import { getMultipleTracks, searchForArtists } from "../services/spotify";

export default function useSetlist(id: string) {
  const { session } = useAuth();

  const { data: setlist, isLoading: setlistLoading } = useQuery({
    queryKey: ["setlist", id],
    queryFn: () => getOneSetlist(id),
    enabled: id !== null,
  });

  const songs = setlist?.sets.set.flatMap((s) => s.song).filter((s) => !s.tape) ?? [];

  const { data: spotifyTracks, isLoading: spotifyTracksLoading } = useQuery({
    queryKey: ["setlist", id, "spotify-tracks"],
    queryFn: () => getMultipleTracks(session?.accessToken, [...songs], setlist),
    enabled: session !== null && setlist !== undefined && songs.length > 0,
  });

  const { data: spotifyArtists, isLoading: spotifyArtistsLoading } = useQuery({
    queryKey: ["setlist", id, "spotify-artist"],
    queryFn: () => searchForArtists(session?.accessToken, setlist?.artist.name),
    enabled: session != null && setlist !== undefined,
  });

  const openWebpage = async () => {
    try {
      if (setlist) await openBrowserAsync(setlist.url);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    data: setlist,
    setlistLoading,
    spotifyTracksLoading,
    spotifyArtist: spotifyArtists ? spotifyArtists[0] : null,
    spotifyArtistsLoading,
    songs,
    openWebpage,
    spotifyTracks: spotifyTracks ?? [],
  };
}
