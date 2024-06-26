import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Layout, useTheme } from "@ui-kitten/components";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ParallaxSetlistList from "@/src/components/Setlist/ParallaxSetlistList";
import FocusAwareStatusBar from "@/src/components/ui/FocusAwareStatusBar";
import { useAuth } from "@/src/providers/AuthProvider";
import { searchArtistSetlist } from "@/src/services/setlist-fm";
import { getOneArtist } from "@/src/services/spotify";
import { Setlist } from "@/src/utils/setlist-fm-types";

export default function ArtistPage() {
  const [nextPage, setNextPage] = useState<number>(1);
  const [setlists, setSetlists] = useState<Setlist[]>([]);

  const { artistId }: { artistId: string } = useLocalSearchParams();
  const { session } = useAuth();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const { data: artist } = useQuery({
    queryKey: ["artist", artistId],
    queryFn: () => getOneArtist(session?.accessToken, artistId),
    enabled: session != null,
  });

  const { data, isPending, isPlaceholderData, refetch, isRefetching, isLoading } = useQuery({
    queryKey: ["setlists", artist?.name, nextPage],
    queryFn: () => searchArtistSetlist(artist?.name, nextPage),
    enabled: artist !== undefined,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data?.setlists) {
      setSetlists((prev) => prev.concat(data.setlists));
    }
  }, [data?.setlists]);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <FocusAwareStatusBar backgroundColor={theme["color-primary-default"]} style="light" />

      <Layout level="2" style={{ flex: 1, marginTop: -insets.top }}>
        <ParallaxSetlistList
          setlists={setlists}
          isPending={isPending}
          isPlaceholderData={isPlaceholderData}
          nextPage={data?.nextPage}
          setNextPage={setNextPage}
          artist={artist}
          loading={isLoading}
          onRefresh={refetch}
          refreshing={isRefetching}
        />
      </Layout>
    </>
  );
}
