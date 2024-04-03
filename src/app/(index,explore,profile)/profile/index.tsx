import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { openBrowserAsync } from "expo-web-browser";
import moment from "moment";
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useMMKVString } from "react-native-mmkv";
import { Avatar, Button, Dialog, List, Portal, Snackbar, Text } from "react-native-paper";

import SwipeableItem from "@/src/components/SwipeableItem";
import UpcomingShowModal from "@/src/components/UpcomingShowModal";
import useCreatedPlaylist from "@/src/hooks/useCreatedPlaylist";
import useUpcomingShows from "@/src/hooks/useUpcomingShows";
import { useAuth } from "@/src/providers/AuthProvider";
import { CreatedPlaylist, getCreatedPlaylists } from "@/src/services/createdPlaylists";
import { UpcomingShow } from "@/src/services/upcomingShows";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRight: {
    marginRight: 16,
  },
  listItem: {
    padding: 8,
  },
});

function InfoDialog({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: (vis: boolean) => void;
}) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={() => setVisible(false)}>
        <Dialog.Title>About Spotify's Web API</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">
            Spotify's API doesn't allow us to remotely delete playlists - you are only deleting them
            from our own database. To fully delete the playlist, please go to the Spotify app.
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setVisible(false)}>OK</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

function CreatedPlaylistItem({
  playlist,
  showSnackbar,
}: {
  playlist: CreatedPlaylist;
  showSnackbar: () => void;
}) {
  const [playlistImage] = useMMKVString(`playlist-${playlist.id}-image`);
  const { removeFromDatabase } = useCreatedPlaylist({ playlistId: playlist.id });

  const openWebPage = async () => {
    try {
      if (playlist) await openBrowserAsync(`https://open.spotify.com/playlist/${playlist.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await removeFromDatabase();
      showSnackbar();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SwipeableItem onEdit={openWebPage} onDelete={handleDelete}>
      <List.Item
        title={playlist.title}
        titleEllipsizeMode="tail"
        left={() => <List.Icon icon={{ uri: playlistImage }} />}
        style={styles.listItem}
      />
    </SwipeableItem>
  );
}

function UpcomingShowItem({ show }: { show: UpcomingShow }) {
  const [showImage] = useMMKVString(`upcoming-show-${show.id}-image`);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { deleteShow } = useUpcomingShows();

  return (
    <>
      <SwipeableItem onEdit={() => setModalVisible(true)} onDelete={() => deleteShow(show)}>
        <List.Item
          title={`${show.artist} - ${show.tour}`}
          description={`${show.venue} / ${show.city} / ${moment(show.date, "YYYY-MM-DD-MM").format("MMMM Do, YYYY")}`}
          titleEllipsizeMode="tail"
          left={() => <List.Icon icon={{ uri: showImage }} />}
          style={styles.listItem}
        />
      </SwipeableItem>

      {modalVisible && (
        <UpcomingShowModal visible={modalVisible} setVisible={setModalVisible} editingShow={show} />
      )}
    </>
  );
}

export default function Profile() {
  const { user, session } = useAuth();
  const { data: playlists } = useQuery({
    queryKey: ["created-playlists"],
    queryFn: () => getCreatedPlaylists(session?.token, user?.id),
    enabled: user !== null,
  });
  const { upcomingShows } = useUpcomingShows();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [infoDialogVisible, setInfoDialogVisible] = useState<boolean>(false);

  return (
    <>
      <Drawer.Screen
        options={{
          drawerLabel: "My Library",
          title: user ? user.displayName ?? user.providerId : "My Library",
          headerRight: () =>
            user ? (
              <Avatar.Image size={36} source={{ uri: user?.avatar ?? "" }} />
            ) : (
              <Avatar.Icon size={36} icon="account" />
            ),
          headerRightContainerStyle: styles.headerRight,
        }}
      />

      <View style={styles.container}>
        <List.AccordionGroup>
          <List.Accordion title={`My Playlists (${playlists?.length ?? 0})`} id="1">
            {!playlists ||
              (playlists?.length === 0 && (
                <List.Item
                  onPress={() => router.replace("/(explore)/explore")}
                  style={styles.listItem}
                  title="Check out some setlists to get started"
                  titleStyle={{ fontWeight: "bold" }}
                  right={() => <List.Icon icon={() => <Ionicons name="search" size={24} />} />}
                />
              ))}
            {playlists?.map((playlist) => (
              <CreatedPlaylistItem
                key={playlist.id}
                playlist={playlist}
                showSnackbar={() => setSnackbarVisible(true)}
              />
            ))}
          </List.Accordion>
          <List.Accordion title={`Upcoming Shows (${upcomingShows.length})`} id="2">
            <List.Item
              onPress={() => setModalVisible(true)}
              style={styles.listItem}
              title="Add New"
              titleStyle={{ fontWeight: "bold" }}
              right={() => <List.Icon icon={() => <Ionicons name="add-circle" size={24} />} />}
            />
            {upcomingShows?.map((show) => <UpcomingShowItem key={show.id} show={show} />)}
          </List.Accordion>
        </List.AccordionGroup>

        {modalVisible && <UpcomingShowModal visible={modalVisible} setVisible={setModalVisible} />}
        {infoDialogVisible && (
          <InfoDialog visible={infoDialogVisible} setVisible={setInfoDialogVisible} />
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
    </>
  );
}
