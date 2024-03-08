import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";

import { Artist } from "../utils/spotify-types";

const styles = StyleSheet.create({
  card: {
    display: "flex",
    alignItems: "center",
    margin: 8,
  },
  cover: {
    height: 175,
    width: 175,
    objectFit: "cover",
  },
});

export default function ArtistPreview({ artist }: { artist: Artist }) {
  const router = useRouter();

  const openArtistPage = () => {
    router.push(`/(tabs)/artist/${artist.id}`);
  };

  return (
    <Card style={styles.card} onPress={openArtistPage}>
      <Card.Cover source={{ uri: artist.images[0].url }} style={styles.cover} />
      <Card.Title
        title={
          <Text variant="titleSmall" numberOfLines={1} ellipsizeMode="head">
            {artist.name}
          </Text>
        }
      />
    </Card>
  );
}
