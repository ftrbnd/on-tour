import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Drawer } from "expo-router/drawer";
import { openBrowserAsync } from "expo-web-browser";
import moment from "moment";
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useMMKVString } from "react-native-mmkv";
import { Avatar, List } from "react-native-paper";

import CreateUpcomingShowModal from "@/src/components/CreateUpcomingShowModal";
import SwipeableItem from "@/src/components/SwipeableItem";
import useStoredPlaylist from "@/src/hooks/useStoredPlaylist";
import useUpcomingShows from "@/src/hooks/useUpcomingShows";
import { useAuth } from "@/src/providers/AuthProvider";
import { StoredPlaylist, getPlaylists } from "@/src/services/savedPlaylists";
import { UpcomingShow } from "@/src/services/upcomingShows";

const styles = StyleSheet.create({
  container: {
    padding: 8,
    display: "flex",
    alignItems: "center",
  },
  headerRight: {
    marginRight: 16,
  },
  listItem: {
    padding: 8,
  },
});

function PlaylistItem({ playlist }: { playlist: StoredPlaylist }) {
  const [playlistImage] = useMMKVString(`playlist-${playlist.id}-image`);
  const { deleteFromDatabase } = useStoredPlaylist({ playlistId: playlist.id });

  const openWebPage = async () => {
    try {
      if (playlist) await openBrowserAsync(`https://open.spotify.com/playlist/${playlist.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SwipeableItem onEdit={() => console.log("edit")} onDelete={deleteFromDatabase}>
      <List.Item
        title={playlist.title}
        titleEllipsizeMode="tail"
        left={() => <List.Icon icon={{ uri: playlistImage }} />}
        right={() => <Ionicons name="open-outline" size={24} onPress={openWebPage} />}
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
        <CreateUpcomingShowModal
          visible={modalVisible}
          setVisible={setModalVisible}
          editingShow={show}
        />
      )}
    </>
  );
}

export default function Profile() {
  const { user, session } = useAuth();
  const { data: playlists } = useQuery({
    queryKey: ["created-playlists"],
    queryFn: () => getPlaylists(session?.token, user?.id),
    enabled: user !== null,
  });
  const { upcomingShows } = useUpcomingShows();

  const [modalVisible, setModalVisible] = useState<boolean>(false);

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

      <View>
        <List.AccordionGroup>
          <List.Accordion title={`My Playlists (${playlists?.length ?? 0})`} id="1">
            {playlists?.map((playlist) => <PlaylistItem key={playlist.id} playlist={playlist} />)}
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

        {modalVisible && (
          <CreateUpcomingShowModal visible={modalVisible} setVisible={setModalVisible} />
        )}
      </View>
    </>
  );
}
