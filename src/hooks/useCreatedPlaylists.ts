import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "../providers/AuthProvider";
import {
  CreatedPlaylist,
  addCreatedPlaylist,
  deleteCreatedPlaylist,
  getCreatedPlaylists,
} from "../services/createdPlaylists";

const QUERY_KEY = "created-playlists";

export default function useCreatedPlaylists(playlistId?: string | null, setlistId?: string | null) {
  const { session, user } = useAuth();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: [QUERY_KEY, setlistId],
    queryFn: () => getCreatedPlaylists(session?.token, user?.id, setlistId),
    enabled: session !== null && user !== null,
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
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });

  const removeFromDatabaseMutation = useMutation({
    mutationFn: () => deleteCreatedPlaylist(session?.token, user?.id, playlistId),
    onSuccess: async () => {
      console.log("Playlist deleted from database!");
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: () => {
      console.error("Failed to delete playlist from database");
    },
  });

  return {
    addToDatabase: addToDatabaseMutation.mutateAsync,
    removeFromDatabase: removeFromDatabaseMutation.mutateAsync,
    playlists: data ?? [],
  };
}
