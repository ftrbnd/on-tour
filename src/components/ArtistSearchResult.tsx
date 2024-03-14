import { Ionicons } from "@expo/vector-icons";
import { useRouter, useSegments } from "expo-router";
import { StyleSheet } from "react-native";
import { Avatar, Card, Text } from "react-native-paper";

import { Artist } from "../utils/spotify-types";
import { SharedSegment } from "../utils/types";

const styles = StyleSheet.create({
  card: {
    margin: 4,
  },
  title: {
    padding: 8,
  },
});

export default function ArtistSearchResult({ artist }: { artist: Artist }) {
  const [segment] = useSegments() as [SharedSegment];
  const router = useRouter();

  const openArtistPage = () => {
    router.push(`/${segment}/artist/${artist.id}`);
  };
  return (
    <Card style={styles.card} onPress={openArtistPage}>
      <Card.Title
        style={styles.title}
        title={
          <Text variant="titleMedium" numberOfLines={1} ellipsizeMode="head">
            {artist.name}
          </Text>
        }
        left={() => <Avatar.Image size={48} source={{ uri: artist.images[0]?.url }} />}
        right={() => <Ionicons size={24} name="arrow-forward-outline" />}
      />
    </Card>
  );
}
