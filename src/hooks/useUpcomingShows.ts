import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePickerAsset } from "expo-image-picker";
import moment from "moment";
import { useToast } from "react-native-toast-notifications";

import { useAuth } from "../providers/AuthProvider";
import {
  getUpcomingShows,
  UpcomingShow,
  addUpcomingShow,
  updateUpcomingShow,
  deleteUpcomingShow,
} from "../services/upcomingShows";
import { storage } from "../utils/mmkv";

const QUERY_KEY = "upcoming-shows";

function sortByDate(shows: UpcomingShow[]) {
  return shows.sort((a, b) => {
    const timeA = moment(a.date).unix();
    const timeB = moment(b.date).unix();

    return timeA - timeB;
  });
}

export default function useUpcomingShows() {
  const { session, user } = useAuth();
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: upcomingShows } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => getUpcomingShows(session?.token, user?.id),
    enabled: session !== null && user !== null,
  });

  const addMutation = useMutation({
    mutationFn: (newShow: Omit<UpcomingShow, "id">) => addUpcomingShow(session?.token, newShow),
    onMutate: async (newShow) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] });

      const previousShows = queryClient.getQueryData<UpcomingShow[]>([QUERY_KEY]);

      const optimisticShow: UpcomingShow = {
        ...newShow,
        id: "temp-id",
      };

      if (previousShows) {
        queryClient.setQueryData<UpcomingShow[]>(
          [QUERY_KEY],
          sortByDate([...previousShows, optimisticShow]),
        );
      }

      return { previousShows };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousShows) {
        queryClient.setQueryData<UpcomingShow[]>([QUERY_KEY], context.previousShows);
      }
      toast.show("Failed to save upcoming show.", {
        type: "danger",
      });
    },
    onSuccess: () => {
      toast.show("Successfully saved upcoming show!");
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (show: UpcomingShow) => updateUpcomingShow(session?.token, show),
    onMutate: async (updatedShow) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] });

      const previousShows = queryClient.getQueryData<UpcomingShow[]>([QUERY_KEY]);

      if (previousShows) {
        queryClient.setQueryData<UpcomingShow[]>(
          [QUERY_KEY],
          sortByDate(
            previousShows.map((show) => (show.id === updatedShow.id ? updatedShow : show)),
          ),
        );
      }

      return { previousShows, updatedShow };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousShows) queryClient.setQueryData([QUERY_KEY], context.previousShows);
      toast.show("Failed to update upcoming show.", {
        type: "danger",
      });
    },
    onSuccess: () => {
      toast.show("Successfully updated upcoming show!");
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (show: UpcomingShow) => deleteUpcomingShow(session?.token, show),
    onMutate: async (deletedShow) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] });

      const previousShows = queryClient.getQueryData<UpcomingShow[]>([QUERY_KEY]);

      if (previousShows) {
        queryClient.setQueryData<UpcomingShow[]>(
          [QUERY_KEY],
          sortByDate(previousShows.filter((show) => show.id !== deletedShow.id)),
        );
      }

      return { previousShows };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousShows) {
        queryClient.setQueryData<UpcomingShow[]>([QUERY_KEY], context.previousShows);
      }
      toast.show("Failed to delete upcoming show.", {
        type: "danger",
      });
    },
    onSuccess: async () => {
      toast.show("Successfully deleted upcoming show!");
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });

  const handleAddUpcomingShow = async (
    newShow: Omit<UpcomingShow, "id">,
    image?: ImagePickerAsset | null,
  ) => {
    try {
      const show = await addMutation.mutateAsync(newShow);

      if (image) storage.set(`upcoming-show-${show.id}-image`, image.uri);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateUpcomingShow = async (show: UpcomingShow, image?: ImagePickerAsset | null) => {
    try {
      const updatedShow = await updateMutation.mutateAsync(show);

      if (image) storage.set(`upcoming-show-${updatedShow.id}-image`, image.uri);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteUpcomingShow = async (show: UpcomingShow) => {
    try {
      await deleteMutation.mutateAsync(show);

      storage.delete(`upcoming-show-${show.id}-image`);
    } catch (e) {
      console.error(e);
    }
  };

  return {
    upcomingShows: upcomingShows ?? [],
    addShow: handleAddUpcomingShow,
    updateShow: handleUpdateUpcomingShow,
    deleteShow: handleDeleteUpcomingShow,
  };
}
