import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { randomUUID } from "expo-crypto";
import { Stack, useLocalSearchParams } from "expo-router";
import moment from "moment";
import { useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Avatar, Card, Divider, FAB, List, Text } from "react-native-paper";

import CreatePlaylistModal from "@/src/components/CreatePlaylistModal";
import PlaylistExistsModal from "@/src/components/PlaylistExistsModal";
import useSetlist from "@/src/hooks/useSetlist";
import useStoredPlaylist from "@/src/hooks/useStoredPlaylist";
import { Song } from "@/src/utils/setlist-fm-types";
import { Image } from "@/src/utils/spotify-types";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    display: "flex",
    gap: 8,
    justifyContent: "flex-start",
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
  list: {
    flex: 1,
    display: "flex",
  },
  bottom: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  image: {
    objectFit: "cover",
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
  const { playlistExists } = useStoredPlaylist({ setlistId });

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  return (
    <>
      <Stack.Screen options={{ headerTitle: `${setlist?.artist.name} Setlist` }} />

      <View style={styles.container}>
        <Card onPress={() => openWebpage()}>
          {setlist?.tour && <Card.Title title={setlist.tour.name} titleStyle={styles.cardTitle} />}
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

        <FlatList
          data={songs}
          ItemSeparatorComponent={() => <Divider />}
          renderItem={({ item, index }) => (
            <SongItem
              item={item}
              image={spotifyTracks
                ?.map((track) => (track ? track.album.images[0] : null))
                .at(index)}
            />
          )}
          keyExtractor={(song) => `${song.name}-${randomUUID()}`}
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
