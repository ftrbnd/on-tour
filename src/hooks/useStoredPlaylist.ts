import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "../providers/AuthProvider";
import { addPlaylist, deletePlaylist } from "../services/db";

interface AddPlaylistVars {
  playlistId: string;
  playlistName: string;
  setlistId: string;
}

export default function useStoredPlaylist(playlistId?: string) {
  const { session, user } = useAuth();
  const queryClient = useQueryClient();

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
    },
    onError: () => {
      console.error("Failed to delete playlist from database");
    },
  });

  return {
    addToDatabase: addToDatabaseMutation.mutateAsync,
    deleteFromDatabase: deletePlaylistMutation.mutateAsync,
  };
}
