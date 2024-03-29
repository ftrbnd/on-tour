import { useQuery } from "@tanstack/react-query";
import { randomUUID } from "expo-crypto";
import { FlatList, StyleSheet, View } from "react-native";

import SetlistPreview from "@/src/components/SetlistPreview";
import { useAuth } from "@/src/providers/AuthProvider";
import { getRecentShows } from "@/src/services/setlist-fm";
import { getTopArtists } from "@/src/services/spotify";

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  list: {
    padding: 8,
  },
});

export default function Recent() {
  const { session } = useAuth();

  const { data } = useQuery({
    queryKey: ["top-artists"],
    queryFn: () => getTopArtists(session?.accessToken),
    enabled: session !== null,
  });

  const { data: recentShows } = useQuery({
    queryKey: ["recent-shows"],
    queryFn: () => getRecentShows(data?.topArtists),
    enabled: data?.topArtists !== undefined,
  });

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={recentShows}
        renderItem={({ item }) => <SetlistPreview setlist={item} displayArtist />}
        keyExtractor={(artist) => `${artist.id}-${randomUUID()}`}
      />
    </View>
  );
}
