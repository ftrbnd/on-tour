import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
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
  const auth = useAuth();

  const { data: artist } = useQuery({
    queryKey: ["artist", id],
    queryFn: () => getOneArtist(auth.providerToken, id),
    enabled: auth.providerToken != null,
  });

  const { data: setlists } = useQuery({
    queryKey: ["setlists", artist?.name],
    queryFn: () => searchArtistSetlist(artist?.name),
    enabled: artist?.name !== null,
  });

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={setlists ?? []}
        renderItem={({ item }) => <SetlistPreview setlist={item} />}
        keyExtractor={(setlist) => setlist.id}
      />
    </View>
  );
}
