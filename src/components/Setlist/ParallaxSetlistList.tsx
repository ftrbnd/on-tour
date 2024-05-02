import { FlashList } from "@shopify/flash-list";
import { Button, Card, Icon, Text, useTheme } from "@ui-kitten/components";
import { router } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { TouchableOpacity } from "react-native-gesture-handler";
import { withAvatarHeaderFlashList } from "react-native-sticky-parallax-header";

import SetlistPreview from "./SetlistPreview";
import LoadingIndicator from "../ui/LoadingIndicator";

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
          <Icon
            name="arrow-back"
            fill={theme["text-control-color"]}
            style={{ height: 24, width: 24 }}
          />
        </TouchableOpacity>
      )}
      leftTopIconOnPress={router.back}
      rightTopIcon={() => (
        <TouchableOpacity>
          <Icon
            name="external-link-outline"
            fill={theme["text-control-color"]}
            style={{ height: 24, width: 24 }}
          />
        </TouchableOpacity>
      )}
      rightTopIconOnPress={() => (artist ? openBrowserAsync(artist?.external_urls.spotify) : null)}
      backgroundColor={theme["color-primary-default"]}
      containerStyle={{ backgroundColor: theme["background-basic-color-2"] }}
      image={artist ? { uri: artist.images[1].url } : ArtistIcon}
      title={artist?.name ?? "Artist"}
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
            <Button disabled accessoryLeft={LoadingIndicator}>
              Loading...
            </Button>
          </Card>
        ) : artist ? (
          <Card>
            <Text category="label" style={{ textAlign: "center" }}>
              {artist && !loading ? "No setlists were found for this artist." : "Loading..."}
            </Text>
          </Card>
        ) : null
      }
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
}
