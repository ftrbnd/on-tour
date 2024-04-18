import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "../providers/AuthProvider";
import {
  CreatedPlaylist,
  addCreatedPlaylist,
  deleteCreatedPlaylist,
  getCreatedPlaylists,
} from "../services/createdPlaylists";

interface UseCreatedPlaylistProps {
  playlistId?: string;
  setlistId?: string;
}

export default function useCreatedPlaylist({ playlistId, setlistId }: UseCreatedPlaylistProps) {
  const { session, user } = useAuth();
  const queryClient = useQueryClient();

  const { data: playlistExists } = useQuery({
    queryKey: ["created-playlists", setlistId],
    queryFn: () => getCreatedPlaylists(session?.token, user?.id, setlistId),
    enabled: session !== null && user !== null && setlistId !== undefined,
  });

  const addToDatabaseMutation = useMutation({
    mutationFn: (vars: Omit<CreatedPlaylist, "userId">) =>
      addCreatedPlaylist(session?.token, {
        id: vars.id,
        userId: user?.id ?? "",
        setlistId: vars.setlistId,
        title: vars.title,
      }),
    onSuccess: async () => {
      console.log("Playlist added to database");
      await queryClient.invalidateQueries({ queryKey: ["created-playlists"] });
    },
  });

  const removeFromDatabaseMutation = useMutation({
    mutationFn: () => deleteCreatedPlaylist(session?.token, user?.id, playlistId),
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
    removeFromDatabase: removeFromDatabaseMutation.mutateAsync,
    playlistExists,
  };
}
