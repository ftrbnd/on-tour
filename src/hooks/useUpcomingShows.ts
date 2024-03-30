import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePickerAsset } from "expo-image-picker";

import { useAuth } from "../providers/AuthProvider";
import { UpcomingShow, addUpcomingShow, getUpcomingShows } from "../services/db";
import { storage } from "../utils/mmkv";

// TODO: implement delete, edit
export default function useUpcomingShows() {
  const { session, user } = useAuth();
  const queryClient = useQueryClient();

  const { data: upcomingShows } = useQuery({
    queryKey: ["upcoming-shows"],
    queryFn: () => getUpcomingShows(session?.token, user?.id),
    enabled: session !== null && user !== null,
  });

  const addUpcomingShowMutation = useMutation({
    mutationFn: (newShow: Omit<UpcomingShow, "id">) => addUpcomingShow(session?.token, newShow),
    onSuccess: (show) => {
      console.log("Added new upcoming show!");
      queryClient.invalidateQueries({ queryKey: ["upcoming-shows"] });
    },
    onError: () => {
      console.error("Failed to add new upcoming show");
    },
  });

  const handleAddUpcomingShow = async (
    newShow: Omit<UpcomingShow, "id">,
    image?: ImagePickerAsset | null,
  ) => {
    try {
      const show = await addUpcomingShowMutation.mutateAsync(newShow);

      if (image) storage.set(`upcoming-show-${show.id}-image`, image.uri);
    } catch (e) {
      console.error(e);
    }
  };

  return { upcomingShows: upcomingShows ?? [], addNew: handleAddUpcomingShow };
}
