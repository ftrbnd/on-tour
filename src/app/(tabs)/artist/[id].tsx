import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { View, FlatList, StyleSheet } from "react-native";

import SetlistPreview from "@/src/components/SetlistPreview";
import { useAuth } from "@/src/providers/AuthProvider";
import { searchArtistSetlist } from "@/src/services/setlist-fm";
import { getOneArtist } from "@/src/services/spotify";

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  list: {
    padding: 8,
  },
});

export default function ArtistPage() {
  const { id }: { id: string } = useLocalSearchParams();
  const { session } = useAuth();
  const router = useRouter();

  const { data: artist } = useQuery({
    queryKey: ["artist", id],
    queryFn: () => getOneArtist(session?.accessToken, id),
    enabled: session?.accessToken != null,
  });

  const { data: setlists } = useQuery({
    queryKey: ["setlists", artist?.name],
    queryFn: () => searchArtistSetlist(artist?.name),
    enabled: artist?.name !== null,
  });

  const openSetlistPage = (setlistId: string) => {
    router.push(`/setlist/${setlistId}`);
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
        keyExtractor={(setlist) => setlist.id}
      />
    </View>
  );
}
