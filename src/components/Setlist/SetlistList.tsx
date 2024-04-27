import { FlashList } from "@shopify/flash-list";
import { Button, Card } from "react-native-paper";

import SetlistPreview from "./SetlistPreview";

import useUpcomingShows from "@/src/hooks/useUpcomingShows";
import { isUpcomingShow } from "@/src/utils/helpers";
import { Setlist } from "@/src/utils/setlist-fm-types";

interface Props {
  setlists: Setlist[];
  isPlaceholderData?: boolean;
  nextPage?: number;
  setNextPage?: (num: number) => void;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export default function SetlistList({
  setlists,
  isPlaceholderData,
  nextPage,
  setNextPage,
  loading,
  refreshing,
  onRefresh,
}: Props) {
  const { upcomingShows } = useUpcomingShows();

  const handleEndReached = () =>
    !isPlaceholderData && nextPage && setNextPage ? setNextPage(nextPage) : null;

  return (
    <FlashList
      estimatedItemSize={150}
      contentContainerStyle={{ padding: 8 }}
      data={setlists}
      renderItem={({ item }) => (
        <SetlistPreview
          setlist={item}
          displayArtist
          isUpcomingShow={isUpcomingShow(item, upcomingShows)}
        />
      )}
      onEndReachedThreshold={nextPage ? 0.5 : null}
      onEndReached={handleEndReached}
      ListEmptyComponent={
        <Card>
          <Card.Content>
            <Button loading={loading} disabled>
              {loading ? "Loading..." : "No setlists were found."}
            </Button>
          </Card.Content>
        </Card>
      }
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
}
