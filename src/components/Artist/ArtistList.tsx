import { FlashList } from "@shopify/flash-list";
import { Button, Card } from "@ui-kitten/components";

import ArtistPreviewSkeleton from "../ui/skeletons/ArtistPreviewSkeleton";

import ArtistPreview from "@/src/components/Artist/ArtistPreview";
import { Artist } from "@/src/utils/spotify-types";

interface Props {
  artists: Artist[];
  isPending: boolean;
  isPlaceholderData?: boolean;
  next?: string | null;
  setNext?: (next: string) => void;
  showsVerticalScrollIndicator?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  isSearchResult?: boolean;
}

export default function ArtistList({
  artists,
  isPending,
  isPlaceholderData,
  next,
  setNext,
  showsVerticalScrollIndicator,
  onRefresh,
  refreshing,
  isSearchResult,
}: Props) {
  const handleEndReached = () => (!isPlaceholderData && next && setNext ? setNext(next) : null);

  const Skeletons = () => [...Array(10).keys()].map((i) => <ArtistPreviewSkeleton key={i} />);

  return (
    <FlashList
      estimatedItemSize={75}
      contentContainerStyle={{ padding: 8 }}
      data={artists}
      renderItem={({ item }) => <ArtistPreview artist={item} isSearchResult={isSearchResult} />}
      onEndReached={handleEndReached}
      onEndReachedThreshold={next ? 0.5 : null}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      ListEmptyComponent={
        isPending ? (
          <Skeletons />
        ) : (
          <Card>
            <Button disabled>No artists were found.</Button>
          </Card>
        )
      }
      onRefresh={onRefresh}
      refreshing={refreshing}
    />
  );
}
