import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { List, Snackbar } from "react-native-paper";

import CreatedPlaylistItem from "@/src/components/Playlist/CreatedPlaylistItem";
import UpcomingShowItem from "@/src/components/UpcomingShow/UpcomingShowItem";
import UpcomingShowModal from "@/src/components/UpcomingShow/UpcomingShowModal";
import InfoDialog from "@/src/components/ui/InfoDialog";
import useCreatedPlaylist from "@/src/hooks/useCreatedPlaylist";
import useUpcomingShows from "@/src/hooks/useUpcomingShows";

const styles = StyleSheet.create({
  listItem: {
    padding: 8,
  },
});

export default function Profile() {
  const { playlists } = useCreatedPlaylist({});
  const { upcomingShows } = useUpcomingShows();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [infoDialogVisible, setInfoDialogVisible] = useState<boolean>(false);

  return (
    <View style={{ flex: 1 }}>
      {/* TODO: improve page ui */}
      <List.Accordion title={`My Playlists (${playlists?.length ?? 0})`} id="1">
        {playlists.length === 0 && (
          <List.Item
            onPress={() => router.replace("/explore")}
            style={styles.listItem}
            title="Check out some setlists to get started"
            titleStyle={{ fontWeight: "bold" }}
            right={() => (
              <List.Icon icon={({ color }) => <Ionicons name="search" size={24} color={color} />} />
            )}
          />
        )}
        <FlatList
          data={playlists}
          renderItem={({ item }) => (
            <CreatedPlaylistItem playlist={item} showSnackbar={() => setSnackbarVisible(true)} />
          )}
          keyExtractor={(item) => item.id}
        />
      </List.Accordion>
      <List.Accordion title={`Upcoming Shows (${upcomingShows.length})`} id="2">
        <List.Item
          onPress={() => setModalVisible(true)}
          style={styles.listItem}
          title="Add New"
          titleStyle={{ fontWeight: "bold" }}
          right={() => (
            <List.Icon
              icon={({ color }) => <Ionicons name="add-circle" size={24} color={color} />}
            />
          )}
        />
        <FlatList
          data={upcomingShows}
          renderItem={({ item }) => <UpcomingShowItem show={item} />}
          keyExtractor={(item) => item.id}
        />
      </List.Accordion>

      {modalVisible && <UpcomingShowModal visible={modalVisible} setVisible={setModalVisible} />}
      {infoDialogVisible && (
        <InfoDialog
          visible={infoDialogVisible}
          setVisible={setInfoDialogVisible}
          title="About Spotify's Web API">
          Spotify's API doesn't allow us to remotely delete playlists - you are only deleting them
          from our own database. To fully delete the playlist, please go to the Spotify app.
        </InfoDialog>
      )}

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: "Learn More",
          onPress: () => setInfoDialogVisible(true),
        }}>
        Playlist deleted from On Tour!
      </Snackbar>
    </View>
  );
}
