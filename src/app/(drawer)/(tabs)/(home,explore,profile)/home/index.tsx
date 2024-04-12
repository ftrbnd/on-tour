import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet, View } from "react-native";

import SetlistPreview from "@/src/components/SetlistPreview";
import { useAuth } from "@/src/providers/AuthProvider";
import { getRecentShows } from "@/src/services/setlist-fm";
import { getTopArtists } from "@/src/services/spotify";

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    enabled: data !== undefined && data.topArtists.length > 0,
  });

  return (
    <View style={styles.container}>
      <FlashList
        estimatedItemSize={150}
        contentContainerStyle={styles.list}
        data={recentShows ?? []}
        renderItem={({ item }) => <SetlistPreview setlist={item} displayArtist />}
      />
    </View>
  );
}
