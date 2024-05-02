import { Avatar, Card, Icon, Layout, Text } from "@ui-kitten/components";
import { useRouter, useSegments } from "expo-router";
import { View } from "react-native";

import { NestedSegment } from "../../utils/segments";
import { Artist } from "../../utils/spotify-types";

import { ArtistIcon } from "@/src/assets/icons";

interface ArtistPreviewProps {
  artist: Artist;
  isSearchResult?: boolean;
}

export default function ArtistPreview({ artist, isSearchResult }: ArtistPreviewProps) {
  const segments = useSegments<NestedSegment>();
  const router = useRouter();

  const openArtistPage = () => {
    router.push(`/${segments[0]}/${segments[1]}/${segments[2]}/artist/${artist.id}`);
  };

  return (
    <Card onPress={openArtistPage} style={{ margin: 8 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Avatar source={artist.images ? { uri: artist.images[0].url } : ArtistIcon} />
          <Text numberOfLines={1} ellipsizeMode="head" style={{ marginLeft: 8 }}>
            {artist.name}
          </Text>
        </View>

        {/* TODO: fix icon visibility */}
        {isSearchResult && (
          <Layout style={{ padding: 8, borderWidth: 1, borderColor: "red" }}>
            <Icon name="arrow-forward-outline" />
          </Layout>
        )}
      </View>
    </Card>
  );
}
