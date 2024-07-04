import { FlashList } from "@shopify/flash-list";
import { Button, Card } from "@ui-kitten/components";
import { usePathname, useRouter } from "expo-router";
import { View } from "react-native";

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
  focusSearch?: () => void;
  tapDisabled?: boolean;
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
  focusSearch,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const handlePress = () => {
    if (pathname !== "/explore") router.replace("/explore");
    else if (focusSearch !== undefined) focusSearch();
  };

  const handleEndReached = () => (!isPlaceholderData && next && setNext ? setNext(next) : null);

  const Skeletons = () => [...Array(10).keys()].map((i) => <ArtistPreviewSkeleton key={i} />);

  return (
    <FlashList
      estimatedItemSize={75}
      contentContainerStyle={{ padding: 8 }}
      data={artists}
      renderItem={({ item }) => (
        <ArtistPreview artist={item} isSearchResult={isSearchResult} tapDisabled />
      )}
      onEndReached={handleEndReached}
      onEndReachedThreshold={next ? 0.5 : null}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      ListEmptyComponent={
        isPending ? (
          <Skeletons />
        ) : (
          <Card>
            <View style={{ gap: 4 }}>
              <Button disabled>No artists were found.</Button>
              <Button appearance="ghost" onPress={handlePress}>
                {pathname === "/explore" ? "Search to get started!" : "Explore to get started!"}
              </Button>
            </View>
          </Card>
        )
      }
      onRefresh={onRefresh}
      refreshing={refreshing}
    />
  );
}
