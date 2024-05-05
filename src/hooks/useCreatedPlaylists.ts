import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "react-native-toast-notifications";

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
  const toast = useToast();

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
    onMutate: async (newCreatedPlaylist) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY, setlistId] });

      const previousPlaylists = queryClient.getQueryData<CreatedPlaylist[]>([QUERY_KEY, setlistId]);

      const optimisticPlaylist: CreatedPlaylist = {
        ...newCreatedPlaylist,
        id: "temp-id",
        userId: "temp-user-id",
      };

      if (previousPlaylists) {
        queryClient.setQueryData<CreatedPlaylist[]>(
          [QUERY_KEY, setlistId],
          [...previousPlaylists, optimisticPlaylist],
        );
      }

      return { previousPlaylists };
    },
    onError: async (_error, _variables, context) => {
      if (context?.previousPlaylists) {
        queryClient.setQueryData<CreatedPlaylist[]>(
          [QUERY_KEY, setlistId],
          context.previousPlaylists,
        );
      }
      toast.show("Failed to save playlist.", {
        type: "danger",
      });
    },
    onSuccess: async () => {
      toast.show("Successfully saved playlist!");
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY, setlistId] });
    },
  });

  const removeFromDatabaseMutation = useMutation({
    mutationFn: () => deleteCreatedPlaylist(session?.token, user?.id, playlistId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY, setlistId] });

      const previousPlaylists = queryClient.getQueryData<CreatedPlaylist[]>([QUERY_KEY, setlistId]);

      if (previousPlaylists) {
        queryClient.setQueryData<CreatedPlaylist[]>(
          [QUERY_KEY, setlistId],
          previousPlaylists.filter((playlist) => playlist.id !== playlistId),
        );
      }

      return { previousPlaylists };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousPlaylists) {
        queryClient.setQueryData<CreatedPlaylist[]>(
          [QUERY_KEY, setlistId],
          context.previousPlaylists,
        );
      }
      toast.show("Failed to delete playlist.", {
        type: "danger",
      });
    },
    onSuccess: async () => {
      toast.show("Successfully deleted playlist!");
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY, setlistId] });
    },
  });

  return {
    addToDatabase: addToDatabaseMutation.mutateAsync,
    removeFromDatabase: removeFromDatabaseMutation.mutateAsync,
    playlists: data ?? [],
  };
}
