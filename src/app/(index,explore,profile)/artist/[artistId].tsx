import { useQuery } from "@tanstack/react-query";
import { randomUUID } from "expo-crypto";
import { Stack, useLocalSearchParams } from "expo-router";
import { View, FlatList, StyleSheet } from "react-native";
import { Card } from "react-native-paper";

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
  cover: {
    borderRadius: 0,
  },
});

export default function ArtistPage() {
  const { artistId }: { artistId: string } = useLocalSearchParams();
  const { session } = useAuth();

  const { data: artist } = useQuery({
    queryKey: ["artist", artistId],
    queryFn: () => getOneArtist(session?.accessToken, artistId),
    enabled: session?.accessToken != null,
  });

  const { data: setlists } = useQuery({
    queryKey: ["setlists", artist?.name],
    queryFn: () => searchArtistSetlist(artist?.name),
    enabled: artist !== undefined && artist.name !== null,
  });

  return (
    <View>
      <Stack.Screen options={{ headerTitle: artist?.name }} />

      {artist && <Card.Cover source={{ uri: artist.images[1].url }} style={styles.cover} />}
      <View style={styles.container}>
        <FlatList
          style={styles.list}
          data={setlists ?? []}
          renderItem={({ item }) => <SetlistPreview setlist={item} />}
          keyExtractor={(setlist) => `${setlist.id}-${randomUUID()}`}
        />
      </View>
    </View>
  );
}
