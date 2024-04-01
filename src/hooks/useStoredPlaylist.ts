import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "../providers/AuthProvider";
import { addPlaylist, deletePlaylist, getPlaylists } from "../services/savedPlaylists";

interface AddPlaylistVars {
  playlistId: string;
  playlistName: string;
  setlistId: string;
}

interface UseStoredPlaylistProps {
  playlistId?: string;
  setlistId?: string;
}

export default function useStoredPlaylist({ playlistId, setlistId }: UseStoredPlaylistProps) {
  const { session, user } = useAuth();
  const queryClient = useQueryClient();

  const { data: playlistExists } = useQuery({
    queryKey: ["playlist-exists", setlistId],
    queryFn: () => getPlaylists(session?.token, user?.id, setlistId),
    enabled: session !== null && user !== null && setlistId !== undefined,
  });

  const addToDatabaseMutation = useMutation({
    mutationFn: (vars: AddPlaylistVars) =>
      addPlaylist(session?.token, user?.id, vars.playlistId, vars.playlistName, vars.setlistId),
    onSuccess: async () => {
      console.log("Playlist added to database");
      await queryClient.invalidateQueries({ queryKey: ["created-playlists"] });
    },
  });

  const deletePlaylistMutation = useMutation({
    mutationFn: () => deletePlaylist(session?.token, user?.id, playlistId),
    onSuccess: async () => {
      console.log("Playlist deleted from database!");
      await queryClient.invalidateQueries({ queryKey: ["created-playlists"] });
      await queryClient.invalidateQueries({ queryKey: ["playlist-exists", setlistId] });
    },
    onError: () => {
      console.error("Failed to delete playlist from database");
    },
  });

  return {
    addToDatabase: addToDatabaseMutation.mutateAsync,
    deleteFromDatabase: deletePlaylistMutation.mutateAsync,
    playlistExists,
  };
}
