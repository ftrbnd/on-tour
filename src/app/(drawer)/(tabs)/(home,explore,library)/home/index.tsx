import { useQuery } from "@tanstack/react-query";
import { Layout } from "@ui-kitten/components";

import SetlistList from "@/src/components/Setlist/SetlistList";
import useFollowingArtists from "@/src/hooks/useFollowingArtists";
import { getRecentShows } from "@/src/services/setlist-fm";

export default function Recent() {
  const { followingArtists } = useFollowingArtists();

  const {
    data: recentShows,
    isPending,
    isFetching,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["setlists"],
    queryFn: () => getRecentShows(followingArtists),
    enabled: followingArtists.length > 0,
  });

  return (
    <Layout level="2" style={{ flex: 1 }}>
      <SetlistList
        setlists={recentShows ?? []}
        isPending={isPending && isFetching}
        loading={isLoading}
        onRefresh={refetch}
        refreshing={isRefetching}
      />
    </Layout>
  );
}
