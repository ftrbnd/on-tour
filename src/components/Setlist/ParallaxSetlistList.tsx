import { Entypo, Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button, Card, Text, useTheme } from "react-native-paper";
import { withAvatarHeaderFlashList } from "react-native-sticky-parallax-header";

import SetlistPreview from "./SetlistPreview";

import { ArtistIcon } from "@/src/assets/icons";
import useUpcomingShows from "@/src/hooks/useUpcomingShows";
import { isUpcomingShow } from "@/src/utils/helpers";
import { Setlist } from "@/src/utils/setlist-fm-types";
import { Artist } from "@/src/utils/spotify-types";

interface Props {
  setlists: Setlist[];
  isPlaceholderData?: boolean;
  nextPage?: number;
  setNextPage?: (num: number) => void;
  artist?: Artist;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
}

const AvatarHeaderFlashList = withAvatarHeaderFlashList<Setlist>(FlashList);

export default function ParallaxSetlistList({
  setlists,
  isPlaceholderData,
  nextPage,
  setNextPage,
  artist,
  loading,
  refreshing,
  onRefresh,
}: Props) {
  const { upcomingShows } = useUpcomingShows();
  const theme = useTheme();

  const handleEndReached = () =>
    !isPlaceholderData && nextPage && setNextPage ? setNextPage(nextPage) : null;

  return (
    <AvatarHeaderFlashList
      parallaxHeight={300}
      hasBorderRadius
      leftTopIcon={() => (
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color={theme.colors.onSecondaryContainer} />
        </TouchableOpacity>
      )}
      leftTopIconOnPress={router.back}
      rightTopIcon={() => (
        <TouchableOpacity>
          <Entypo name="spotify" size={24} color={theme.colors.onSecondaryContainer} />
        </TouchableOpacity>
      )}
      rightTopIconOnPress={() => (artist ? openBrowserAsync(artist?.external_urls.spotify) : null)}
      backgroundColor={theme.colors.secondaryContainer}
      containerStyle={{ backgroundColor: theme.colors.surface }}
      image={artist ? { uri: artist.images[1].url } : ArtistIcon}
      title={artist?.name ?? "Artist"}
      titleStyle={{
        color: theme.colors.onSecondaryContainer,
      }}
      estimatedItemSize={150}
      contentContainerStyle={{ padding: 8 }}
      data={setlists}
      renderItem={({ item }) => (
        <SetlistPreview
          setlist={item}
          displayArtist={!artist}
          artistImage={artist?.images[1].url}
          isUpcomingShow={isUpcomingShow(item, upcomingShows)}
        />
      )}
      onEndReachedThreshold={nextPage ? 0.5 : null}
      onEndReached={handleEndReached}
      ListEmptyComponent={
        loading ? (
          <Card>
            <Card.Content>
              <Button loading={loading} disabled>
                Loading...
              </Button>
            </Card.Content>
          </Card>
        ) : artist ? (
          <Card>
            <Card.Content>
              <Text variant="titleSmall" style={{ textAlign: "center" }}>
                {artist && !loading ? "No setlists were found for this artist." : "Loading..."}
              </Text>
            </Card.Content>
          </Card>
        ) : null
      }
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
}
