import { useQuery } from "@tanstack/react-query";
import { randomUUID } from "expo-crypto";
import { Stack, useLocalSearchParams, useRouter, useSegments } from "expo-router";
import { View, FlatList, StyleSheet } from "react-native";

import SetlistPreview from "@/src/components/SetlistPreview";
import { useAuth } from "@/src/providers/AuthProvider";
import { searchArtistSetlist } from "@/src/services/setlist-fm";
import { getOneArtist } from "@/src/services/spotify";
import { SharedSegment } from "@/src/utils/types";

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  list: {
    padding: 8,
  },
});

export default function ArtistPage() {
  const { artistId }: { artistId: string } = useLocalSearchParams();
  const { session } = useAuth();
  const [segment] = useSegments() as [SharedSegment];

  const router = useRouter();

  const { data: artist } = useQuery({
    queryKey: ["artist", artistId],
    queryFn: () => getOneArtist(session?.accessToken, artistId),
    enabled: session?.accessToken != null,
  });

  const { data: setlists } = useQuery({
    queryKey: ["setlists", artist?.name],
    queryFn: () => searchArtistSetlist(artist?.name),
    enabled: artist?.name !== null,
  });

  const openSetlistPage = (setlistId: string) => {
    router.push(`/${segment}/${setlistId}`);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: artist?.name }} />
      <FlatList
        style={styles.list}
        data={setlists ?? []}
        renderItem={({ item }) => (
          <SetlistPreview onPress={() => openSetlistPage(item.id)} setlist={item} />
        )}
        keyExtractor={(setlist) => `${setlist.id}-${randomUUID()}`}
      />
    </View>
  );
}
