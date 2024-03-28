import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Drawer } from "expo-router/drawer";
import { openBrowserAsync } from "expo-web-browser";
import { View, StyleSheet } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { useMMKVString } from "react-native-mmkv";
import { Avatar, List, Text } from "react-native-paper";

import useStoredPlaylist from "@/src/hooks/useStoredPlaylist";
import { useAuth } from "@/src/providers/AuthProvider";
import { StoredPlaylist, getPlaylists } from "@/src/services/db";

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
  swipeDelete: {
    backgroundColor: "red",
    padding: 16,
    color: "white",
  },
});

export default function Profile() {
  const { user, session } = useAuth();

  const { data: playlists } = useQuery({
    queryKey: ["created-playlists"],
    queryFn: () => getPlaylists(session?.token, user?.id),
    enabled: user !== null,
  });

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
          <List.Accordion title="My Playlists" id="1">
            {playlists?.map((playlist) => <PlaylistItem key={playlist.id} playlist={playlist} />)}
          </List.Accordion>
          <List.Accordion title="Upcoming Shows" id="2">
            <List.Item title="Item 2" />
          </List.Accordion>
        </List.AccordionGroup>
      </View>
    </>
  );
}

function PlaylistItem({ playlist }: { playlist: StoredPlaylist }) {
  const [playlistImage] = useMMKVString(`playlist-${playlist.id}-image`);
  const { deleteFromDatabase } = useStoredPlaylist(playlist.id);

  const openWebPage = async () => {
    try {
      if (playlist) await openBrowserAsync(`https://open.spotify.com/playlist/${playlist.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const renderRightActions = () => {
    return (
      <Text style={styles.swipeDelete} onPress={() => deleteFromDatabase()}>
        Delete
      </Text>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <List.Item
        title={playlist.title}
        titleEllipsizeMode="tail"
        left={() => <List.Icon icon={{ uri: playlistImage }} />}
        right={() => <Ionicons name="open-outline" size={24} onPress={openWebPage} />}
        style={styles.listItem}
      />
    </Swipeable>
  );
}
