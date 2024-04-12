import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

import SetlistList from "@/src/components/Setlist/SetlistList";
import { useAuth } from "@/src/providers/AuthProvider";
import { searchArtistSetlist } from "@/src/services/setlist-fm";
import { getOneArtist } from "@/src/services/spotify";
import { Setlist } from "@/src/utils/setlist-fm-types";

export default function ArtistPage() {
  const [nextPage, setNextPage] = useState<number>(1);
  const [setlists, setSetlists] = useState<Setlist[]>([]);

  const { artistId }: { artistId: string } = useLocalSearchParams();
  const { session } = useAuth();

  const { data: artist } = useQuery({
    queryKey: ["artist", artistId],
    queryFn: () => getOneArtist(session?.accessToken, artistId),
    enabled: session != null,
  });

  const { data, isPlaceholderData, refetch, isRefetching } = useQuery({
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
          headerTitle: artist?.name,
          headerBackVisible: true,
          headerLeft: () => null,
        }}
      />

      <View style={{ flex: 1 }}>
        <SetlistList
          setlists={setlists}
          isPlaceholderData={isPlaceholderData}
          nextPage={data?.nextPage}
          setNextPage={setNextPage}
          artist={artist}
          onRefresh={refetch}
          refreshing={isRefetching}
        />
      </View>
    </>
  );
}
