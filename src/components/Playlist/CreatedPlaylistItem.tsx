import { openBrowserAsync } from "expo-web-browser";
import { StyleSheet } from "react-native";
import { useMMKVString } from "react-native-mmkv";
import { List } from "react-native-paper";

import useCreatedPlaylist from "../../hooks/useCreatedPlaylist";
import { CreatedPlaylist } from "../../services/createdPlaylists";
import SwipeableItem from "../ui/SwipeableItem";

const styles = StyleSheet.create({
  listItem: {
    padding: 8,
  },
});

export default function CreatedPlaylistItem({
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
