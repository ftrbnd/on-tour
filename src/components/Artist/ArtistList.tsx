import { FlashList } from "@shopify/flash-list";

import ArtistPreview from "@/src/components/Artist/ArtistPreview";
import { Artist } from "@/src/utils/spotify-types";

interface Props {
  artists: Artist[];
  isPlaceholderData?: boolean;
  next?: string | null;
  setNext?: (next: string) => void;
  showsVerticalScrollIndicator?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export default function ArtistList({
  artists,
  isPlaceholderData,
  next,
  setNext,
  showsVerticalScrollIndicator,
  onRefresh,
  refreshing,
}: Props) {
  const handleEndReached = () => (!isPlaceholderData && next && setNext ? setNext(next) : null);

  return (
    <FlashList
      estimatedItemSize={75}
      contentContainerStyle={{ padding: 8 }}
      data={artists}
      renderItem={({ item }) => <ArtistPreview artist={item} isSearchResult={false} />}
      onEndReached={handleEndReached}
      onEndReachedThreshold={next ? 0.5 : null}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      onRefresh={onRefresh}
      refreshing={refreshing}
    />
  );
}
