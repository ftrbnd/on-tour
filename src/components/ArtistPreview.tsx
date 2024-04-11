import { Ionicons } from "@expo/vector-icons";
import { useRouter, useSegments } from "expo-router";
import { StyleSheet } from "react-native";
import { Avatar, Card, Text } from "react-native-paper";

import { NestedSegment } from "../utils/segments";
import { Artist } from "../utils/spotify-types";

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
  const segments = useSegments<NestedSegment>();
  const router = useRouter();

  const openArtistPage = () => {
    router.push(`/${segments[0]}/${segments[1]}/${segments[2]}/artist/${artist.id}`);
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
