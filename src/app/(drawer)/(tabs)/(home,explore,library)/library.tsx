import { FlashList } from "@shopify/flash-list";
import { Button, Card, Icon, Layout, Text } from "@ui-kitten/components";
import { useRouter, useSegments } from "expo-router";
import { memo } from "react";
import { View } from "react-native";
import { SheetManager } from "react-native-actions-sheet";

import CreatedPlaylistItem from "@/src/components/Playlist/CreatedPlaylistItem";
import UpcomingShowItem from "@/src/components/UpcomingShow/UpcomingShowItem";
import UpcomingShowItemSkeleton from "@/src/components/ui/skeletons/UpcomingShowItemSkeleton";
import VerticalPlaylistItemSkeleton from "@/src/components/ui/skeletons/VerticalPlaylistItemSkeleton";
import useCreatedPlaylists from "@/src/hooks/useCreatedPlaylists";
import useUpcomingShows from "@/src/hooks/useUpcomingShows";
import { NestedSegment } from "@/src/utils/segments";

export default function Library() {
  const { upcomingShows, isPending } = useUpcomingShows();

  const Skeletons = () => [...Array(10).keys()].map((i) => <UpcomingShowItemSkeleton key={i} />);

  return (
    <Layout level="2" style={{ flex: 1 }}>
      <FlashList
        ListHeaderComponent={<Header />}
        estimatedItemSize={100}
        data={upcomingShows}
        renderItem={({ item }) => <UpcomingShowItem show={item} />}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          isPending ? (
            <Skeletons />
          ) : (
            <Card style={{ marginHorizontal: 16 }}>
              <Text category="s1">You have no upcoming shows.</Text>
            </Card>
          )
        }
      />
    </Layout>
  );
}

const Header = memo(function HeaderComponent() {
  const { playlists, isPending } = useCreatedPlaylists();
  const router = useRouter();
  const segments = useSegments<NestedSegment>();

  const Skeletons = () => [...Array(3).keys()].map((i) => <VerticalPlaylistItemSkeleton key={i} />);

  const hasNoPlaylists = playlists.length === 0 && !isPending;

  return (
    <View style={{ flex: 1, marginTop: 8 }}>
      <Title
        title="My Playlists"
        icon={hasNoPlaylists ? "search-outline" : "chevron-right-outline"}
        onPress={() =>
          router.push(
            hasNoPlaylists
              ? `/${segments[0]}/${segments[1]}/explore`
              : `/${segments[0]}/${segments[1]}/${segments[2]}/createdPlaylists`,
          )
        }
      />

      {hasNoPlaylists ? (
        <Card style={{ marginHorizontal: 16 }}>
          <Text category="s1">Check out some setlists to get started!</Text>
        </Card>
      ) : (
        <FlashList
          horizontal
          showsHorizontalScrollIndicator={false}
          estimatedItemSize={200}
          contentContainerStyle={{ padding: 8 }}
          data={playlists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CreatedPlaylistItem playlist={item} />}
          ListEmptyComponent={isPending ? <Skeletons /> : null}
        />
      )}

      <Title
        title="My Upcoming Shows"
        icon="plus-outline"
        onPress={async () => await SheetManager.show("upcoming-show-sheet")}
      />
    </View>
  );
});

const Title = ({ title, icon, onPress }: { title: string; icon: string; onPress: () => void }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
      <Text category="h4" style={{ textAlign: "left", paddingLeft: 16 }}>
        {title}
      </Text>
      <Button
        appearance="ghost"
        status="primary"
        accessoryLeft={<Icon name={icon} />}
        onPress={onPress}
      />
    </View>
  );
};
