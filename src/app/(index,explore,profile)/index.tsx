import { useQuery } from "@tanstack/react-query";
import { randomUUID } from "expo-crypto";
import { Stack } from "expo-router";
import { FlatList, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

import ArtistPreview from "@/src/components/ArtistPreview";
import { useAuth } from "@/src/providers/AuthProvider";
import { getTopArtists } from "@/src/services/spotify";

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  list: {
    padding: 8,
  },
});

export default function Home() {
  const { session } = useAuth();

  const { data: topArtists } = useQuery({
    queryKey: ["top-artists"],
    queryFn: () => getTopArtists(session?.accessToken),
    enabled: session !== null && session !== undefined,
  });

  return (
    <>
      <Stack.Screen options={{ title: "On Tour" }} />
      <View style={styles.container}>
        <Text variant="displayMedium">Your Artists</Text>

        <FlatList
          style={styles.list}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={topArtists ?? []}
          renderItem={({ item }) => <ArtistPreview artist={item} />}
          keyExtractor={(artist) => `${artist.id}-${randomUUID()}`}
        />
      </View>
    </>
  );
}
