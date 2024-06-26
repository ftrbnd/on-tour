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

export default function useCreatedPlaylists(playlistId?: string | null) {
  const { session, user } = useAuth();
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data, isPending } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => getCreatedPlaylists(session?.token, user?.id),
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
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] });

      const previousPlaylists = queryClient.getQueryData<CreatedPlaylist[]>([QUERY_KEY]);

      const optimisticPlaylist: CreatedPlaylist = {
        ...newCreatedPlaylist,
        id: "temp-id",
        userId: "temp-user-id",
      };

      if (previousPlaylists) {
        queryClient.setQueryData<CreatedPlaylist[]>(
          [QUERY_KEY],
          [...previousPlaylists, optimisticPlaylist],
        );
      }

      return { previousPlaylists };
    },
    onError: async (_error, _variables, context) => {
      if (context?.previousPlaylists) {
        queryClient.setQueryData<CreatedPlaylist[]>([QUERY_KEY], context.previousPlaylists);
      }
      toast.show("Failed to save playlist.", {
        type: "danger",
      });
    },
    onSuccess: async () => {
      toast.show("Successfully saved playlist!");
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });

  const removeFromDatabaseMutation = useMutation({
    mutationFn: () => deleteCreatedPlaylist(session?.token, user?.id, playlistId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] });

      const previousPlaylists = queryClient.getQueryData<CreatedPlaylist[]>([QUERY_KEY]);

      if (previousPlaylists) {
        queryClient.setQueryData<CreatedPlaylist[]>(
          [QUERY_KEY],
          previousPlaylists.filter((playlist) => playlist.id !== playlistId),
        );
      }

      return { previousPlaylists };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousPlaylists) {
        queryClient.setQueryData<CreatedPlaylist[]>([QUERY_KEY], context.previousPlaylists);
      }
      toast.show("Failed to delete playlist.", {
        type: "danger",
      });
    },
    onSuccess: async () => {
      toast.show("Successfully deleted playlist!");
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });

  return {
    addToDatabase: addToDatabaseMutation.mutateAsync,
    removeFromDatabase: removeFromDatabaseMutation.mutateAsync,
    playlists: data ?? [],
    isPending,
  };
}
