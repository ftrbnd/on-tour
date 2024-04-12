import { FlashList } from "@shopify/flash-list";
import { Card, Text } from "react-native-paper";

import SetlistPreview from "./SetlistPreview";

import { Setlist } from "@/src/utils/setlist-fm-types";
import { Artist } from "@/src/utils/spotify-types";

interface Props {
  setlists: Setlist[];
  isPlaceholderData?: boolean;
  nextPage?: number;
  setNextPage?: (num: number) => void;
  artist?: Artist;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export default function SetlistList({
  setlists,
  isPlaceholderData,
  nextPage,
  setNextPage,
  artist,
  refreshing,
  onRefresh,
}: Props) {
  const handleEndReached = () =>
    !isPlaceholderData && nextPage && setNextPage ? setNextPage(nextPage) : null;

  return (
    <FlashList
      estimatedItemSize={150}
      contentContainerStyle={{ padding: 8 }}
      data={setlists}
      renderItem={({ item }) => <SetlistPreview setlist={item} displayArtist />}
      onEndReachedThreshold={nextPage ? 0.5 : null}
      onEndReached={handleEndReached}
      ListHeaderComponent={
        artist ? (
          <Card.Cover
            source={{ uri: artist.images[1].url }}
            style={{ borderRadius: 0, marginHorizontal: -8, marginTop: -8, marginBottom: 8 }}
          />
        ) : null
      }
      ListEmptyComponent={artist ? <Text>No setlists were found for this artist.</Text> : null}
      ListFooterComponent={
        artist ? <Text>Looks like there are no more setlists for this artist.</Text> : null
      }
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
}
