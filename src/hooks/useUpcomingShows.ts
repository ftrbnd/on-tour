import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePickerAsset } from "expo-image-picker";

import { useAuth } from "../providers/AuthProvider";
import {
  getUpcomingShows,
  UpcomingShow,
  addUpcomingShow,
  updateUpcomingShow,
  deleteUpcomingShow,
} from "../services/upcomingShows";
import { storage } from "../utils/mmkv";

export default function useUpcomingShows() {
  const { session, user } = useAuth();
  const queryClient = useQueryClient();

  const { data: upcomingShows } = useQuery({
    queryKey: ["upcoming-shows"],
    queryFn: () => getUpcomingShows(session?.token, user?.id),
    enabled: session !== null && user !== null,
  });

  const addMutation = useMutation({
    mutationFn: (newShow: Omit<UpcomingShow, "id">) => addUpcomingShow(session?.token, newShow),
    onSuccess: async (show) => {
      console.log("Added new upcoming show!");
      await queryClient.invalidateQueries({ queryKey: ["upcoming-shows"] });
    },
    onError: () => {
      console.error("Failed to add new upcoming show");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (show: UpcomingShow) => updateUpcomingShow(session?.token, show),
    onSuccess: async (show) => {
      console.log("Successfully updated upcoming show!");
      await queryClient.invalidateQueries({ queryKey: ["upcoming-shows"] });
    },
    onError: () => {
      console.error("Failed to update upcoming show");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (show: UpcomingShow) => deleteUpcomingShow(session?.token, show),
    onSuccess: async (show) => {
      console.log("Successfully deleted upcoming show!");
      await queryClient.invalidateQueries({ queryKey: ["upcoming-shows"] });
    },
    onError: () => {
      console.error("Failed to delete upcoming show");
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
