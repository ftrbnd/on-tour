import { useQuery } from "@tanstack/react-query";
import { View } from "react-native";

import SetlistList from "@/src/components/Setlist/SetlistList";
import { useAuth } from "@/src/providers/AuthProvider";
import { getRecentShows } from "@/src/services/setlist-fm";
import { getTopArtists } from "@/src/services/spotify";

export default function Recent() {
  const { session } = useAuth();

  const { data } = useQuery({
    queryKey: ["top-artists"],
    queryFn: () => getTopArtists(session?.accessToken),
    enabled: session !== null,
  });

  const {
    data: recentShows,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["setlists"],
    queryFn: () => getRecentShows(data?.topArtists),
    enabled: data !== undefined && data.topArtists.length > 0,
  });

  return (
    <View style={{ flex: 1 }}>
      <SetlistList
        setlists={recentShows ?? []}
        loading={isLoading}
        onRefresh={refetch}
        refreshing={isRefetching}
      />
    </View>
  );
}
