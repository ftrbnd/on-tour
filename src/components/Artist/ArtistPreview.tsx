import { Avatar, Card, Icon, Text, useTheme } from "@ui-kitten/components";
import { useRouter, useSegments } from "expo-router";
import { View } from "react-native";

import { NestedSegment } from "../../utils/segments";
import { Artist } from "../../utils/spotify-types";

import { ArtistIcon } from "@/src/assets/icons";

interface ArtistPreviewProps {
  artist: Artist;
  isSearchResult?: boolean;
  tapDisabled?: boolean;
}

export default function ArtistPreview({ artist, isSearchResult, tapDisabled }: ArtistPreviewProps) {
  const segments = useSegments<NestedSegment>();
  const router = useRouter();
  const theme = useTheme();

  const openArtistPage = () => {
    router.push(
      `/${segments[0]}/${segments[1]}/${segments[2]}/artist/${artist.id}?name=${artist.name}&image=${artist.images[0].url}`,
    );
  };

  return (
    <Card disabled={tapDisabled} onPress={openArtistPage} style={{ margin: 8 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Avatar source={artist.images.length > 0 ? { uri: artist.images[0].url } : ArtistIcon} />
          <Text numberOfLines={1} ellipsizeMode="head" style={{ marginLeft: 8 }}>
            {artist.name}
          </Text>
        </View>

        {isSearchResult && (
          <Icon
            name="chevron-right-outline"
            style={{ height: 24, width: 24 }}
            fill={theme["text-basic-color"]}
          />
        )}
      </View>
    </Card>
  );
}
