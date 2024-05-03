import { FlashList } from "@shopify/flash-list";
import { Button, Card, Icon, Layout, Text } from "@ui-kitten/components";
import { useRouter, useSegments } from "expo-router";
import { memo, useState } from "react";
import { View } from "react-native";

import CreatedPlaylistItem from "@/src/components/Playlist/CreatedPlaylistItem";
import UpcomingShowItem from "@/src/components/UpcomingShow/UpcomingShowItem";
import UpcomingShowModal from "@/src/components/UpcomingShow/UpcomingShowModal";
import InfoDialog from "@/src/components/ui/InfoDialog";
import useCreatedPlaylists from "@/src/hooks/useCreatedPlaylists";
import useUpcomingShows from "@/src/hooks/useUpcomingShows";
import { NestedSegment } from "@/src/utils/segments";

export default function Library() {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { upcomingShows } = useUpcomingShows();

  return (
    <Layout level="2" style={{ flex: 1 }}>
      <FlashList
        ListHeaderComponent={<Header setModalVisible={setModalVisible} />}
        estimatedItemSize={100}
        data={upcomingShows}
        renderItem={({ item }) => <UpcomingShowItem show={item} />}
        keyExtractor={(item) => item.id}
      />

      {modalVisible && <UpcomingShowModal visible={modalVisible} setVisible={setModalVisible} />}
    </Layout>
  );
}

interface HeaderProps {
  setModalVisible: (v: boolean) => void;
}

const Header = memo(function HeaderComponent({ setModalVisible }: HeaderProps) {
  const [infoDialogVisible, setInfoDialogVisible] = useState<boolean>(false);

  const { playlists } = useCreatedPlaylists();
  const router = useRouter();
  const segments = useSegments<NestedSegment>();

  return (
    <View style={{ flex: 1 }}>
      <Title title="My Playlists" icon="info-outline" onPress={() => setInfoDialogVisible(true)} />

      {infoDialogVisible && (
        <InfoDialog
          visible={infoDialogVisible}
          setVisible={setInfoDialogVisible}
          title="About Spotify's Web API">
          Spotify's API doesn't allow us to remotely delete playlists - you are only deleting them
          from our own database. To fully delete the playlist, please go to the Spotify app.
        </InfoDialog>
      )}

      {playlists.length === 0 ? (
        <Card style={{ marginHorizontal: 16 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 4,
            }}>
            <Text category="s1">Check out some setlists to get started!</Text>
            <Button appearance="ghost" onPress={() => router.replace("/explore")}>
              Explore
            </Button>
          </View>
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
        />
      )}
      {playlists.length > 0 && (
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <Button
            appearance="ghost"
            accessoryRight={<Icon name="chevron-right-outline" />}
            onPress={() =>
              router.push(`/${segments[0]}/${segments[1]}/${segments[2]}/createdPlaylists`)
            }>
            View All
          </Button>
        </View>
      )}

      <Title title="My Upcoming Shows" icon="plus-outline" onPress={() => setModalVisible(true)} />
    </View>
  );
});

const Title = ({ title, icon, onPress }: { title: string; icon: string; onPress: () => void }) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
    <Text category="h4" style={{ textAlign: "left", paddingLeft: 16 }}>
      {title}
    </Text>
    <Button appearance="ghost" accessoryLeft={<Icon name={icon} />} onPress={onPress} />
  </View>
);
