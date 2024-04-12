import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Stack, useLocalSearchParams } from "expo-router";
import moment from "moment";
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Card, Divider, FAB, List, Text } from "react-native-paper";

import CreatePlaylistModal from "@/src/components/Playlist/CreatePlaylistModal";
import PlaylistExistsModal from "@/src/components/Playlist/PlaylistExistsModal";
import useCreatedPlaylist from "@/src/hooks/useCreatedPlaylist";
import useSetlist from "@/src/hooks/useSetlist";
import { Song } from "@/src/utils/setlist-fm-types";
import { Image } from "@/src/utils/spotify-types";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    justifyContent: "flex-start",
  },
  card: {
    margin: 8,
  },
  cardTitle: { fontWeight: "bold", textAlign: "center" },
  cardContent: {
    display: "flex",
    gap: 8,
  },
  detail: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

function SongItem({ item, image }: { item: Song; image: Image | null | undefined }) {
  return (
    <List.Item
      title={() => <Text variant="titleMedium">{item.name}</Text>}
      left={() =>
        image ? (
          <Avatar.Image size={48} source={{ uri: image.url }} />
        ) : (
          <List.Icon icon={() => <Ionicons name="musical-note" size={48} color="black" />} />
        )
      }
    />
  );
}

export default function SetlistPage() {
  const { setlistId }: { setlistId: string } = useLocalSearchParams();
  const { data: setlist, songs, spotifyTracks, openWebpage } = useSetlist(setlistId);
  const { playlistExists } = useCreatedPlaylist({ setlistId });

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: `Setlist`,
          headerBackVisible: true,
          headerLeft: () => null,
        }}
      />

      <View style={styles.container}>
        <Card style={styles.card} onPress={() => openWebpage()}>
          {setlist?.artist && (
            <Card.Title
              title={setlist.artist.name}
              titleStyle={styles.cardTitle}
              subtitle={setlist.tour?.name}
              subtitleStyle={setlist.tour ? styles.cardTitle : null}
            />
          )}
          <Card.Content style={[styles.cardContent, !setlist?.tour && { padding: 16 }]}>
            <View style={styles.detail}>
              <FontAwesome5 name="building" size={24} color="black" />
              <Text>{`${setlist?.venue.name}`}</Text>
            </View>
            <View style={styles.detail}>
              <FontAwesome5 name="city" size={24} color="black" />
              <Text>{`${setlist?.venue.city.name}, ${setlist?.venue.city.state}, ${setlist?.venue.city.country.code}`}</Text>
            </View>
            <View style={styles.detail}>
              <FontAwesome5 name="calendar-day" size={24} color="black" />
              <Text>{moment(setlist?.eventDate, "DD-MM-YYYY").format("MMMM Do, YYYY")}</Text>
            </View>
          </Card.Content>
        </Card>

        <FlashList
          estimatedItemSize={75}
          contentContainerStyle={{ padding: 8 }}
          data={songs ?? []}
          renderItem={({ item, index }) => (
            <SongItem
              item={item}
              image={spotifyTracks
                ?.map((track) => (track ? track.album.images[0] : null))
                .at(index)}
            />
          )}
          ItemSeparatorComponent={() => <Divider />}
        />

        {/* TODO: doesn't update when deleted from database */}
        {setlist && playlistExists && playlistExists?.length > 0 ? (
          <PlaylistExistsModal
            visible={modalVisible}
            setVisible={setModalVisible}
            playlistId={playlistExists[0].id}
          />
        ) : (
          <CreatePlaylistModal
            visible={modalVisible}
            setVisible={setModalVisible}
            setlistId={setlistId}
          />
        )}

        <FAB
          icon={() => <Ionicons name="cloud-upload" size={24} color="black" />}
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        />
      </View>
    </>
  );
}
