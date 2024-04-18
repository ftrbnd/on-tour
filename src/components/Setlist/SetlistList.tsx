import { FlashList } from "@shopify/flash-list";
import { Button, Card, Text } from "react-native-paper";

import SetlistPreview from "./SetlistPreview";

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

export default function SetlistList({
  setlists,
  isPlaceholderData,
  nextPage,
  setNextPage,
  artist,
  loading,
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
      renderItem={({ item }) => <SetlistPreview setlist={item} displayArtist={!artist} />}
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
