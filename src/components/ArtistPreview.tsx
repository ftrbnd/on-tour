import { useRouter, useSegments } from "expo-router";
import { StyleSheet } from "react-native";
import { Avatar, Card } from "react-native-paper";

import { Artist } from "../utils/spotify-types";
import { SharedSegment } from "../utils/types";

const styles = StyleSheet.create({
  card: {
    margin: 8,
  },
  title: {
    marginLeft: 8,
  },
});

export default function ArtistPreview({ artist }: { artist: Artist }) {
  const [segment] = useSegments() as [SharedSegment];
  const router = useRouter();

  return (
    <Card style={styles.card} onPress={() => router.push(`/${segment}/artist/${artist.id}`)}>
      <Card.Title
        title={artist.name}
        titleVariant="titleMedium"
        titleStyle={styles.title}
        left={() => <Avatar.Image size={50} source={{ uri: artist.images[0]?.url ?? "" }} />}
      />
    </Card>
  );
}
