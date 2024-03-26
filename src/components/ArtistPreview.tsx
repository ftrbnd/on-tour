import { Ionicons } from "@expo/vector-icons";
import { useRouter, useSegments } from "expo-router";
import { StyleSheet } from "react-native";
import { Avatar, Card, Text } from "react-native-paper";

import { Artist } from "../utils/spotify-types";
import { SharedSegment } from "../utils/types";

const styles = StyleSheet.create({
  card: {
    margin: 8,
  },
  title: {
    marginLeft: 8,
  },
  right: {
    marginRight: 8,
  },
});

interface ArtistPreviewProps {
  artist: Artist;
  isSearchResult: boolean;
}

export default function ArtistPreview({ artist, isSearchResult }: ArtistPreviewProps) {
  const [segment] = useSegments() as [SharedSegment];
  const router = useRouter();

  const openArtistPage = () => {
    router.push(`/${segment}/artist/${artist.id}`);
  };

  return (
    <Card style={styles.card} onPress={openArtistPage}>
      <Card.Title
        title={
          <Text variant="titleMedium" numberOfLines={1} ellipsizeMode="head">
            {artist.name}
          </Text>
        }
        titleStyle={styles.title}
        left={() => <Avatar.Image size={50} source={{ uri: artist.images[0]?.url ?? "" }} />}
        right={() => (isSearchResult ? <Ionicons size={24} name="arrow-forward-outline" /> : null)}
        rightStyle={styles.right}
      />
    </Card>
  );
}
