import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { openBrowserAsync } from "expo-web-browser";
import { useState } from "react";
import { Card, Menu } from "react-native-paper";

import useCreatedPlaylists from "../../hooks/useCreatedPlaylists";
import { CreatedPlaylist } from "../../services/createdPlaylists";

import { PlaylistIcon } from "@/src/assets/icons";
import { useAuth } from "@/src/providers/AuthProvider";
import { getOnePlaylist } from "@/src/services/spotify";

interface Props {
  playlist: CreatedPlaylist;
  showSnackbar: () => void;
}

export default function CreatedPlaylistItem({ playlist, showSnackbar }: Props) {
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  const { removeFromDatabase } = useCreatedPlaylists(playlist.id);
  const { session } = useAuth();

  const { data: spotifyPlaylist } = useQuery({
    queryKey: ["playlists", playlist.id],
    queryFn: () => getOnePlaylist(session?.accessToken, playlist.id),
    enabled: session !== null,
  });

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
    <Menu
      visible={menuVisible}
      onDismiss={() => setMenuVisible(false)}
      anchor={
        <Card
          style={{ width: 200, margin: 8 }}
          onPress={openWebPage}
          onLongPress={() => setMenuVisible(true)}>
          <Card.Cover
            source={spotifyPlaylist ? { uri: spotifyPlaylist.images[0].url } : PlaylistIcon}
            style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
          />
          <Card.Title
            title={playlist.title}
            titleNumberOfLines={2}
            titleStyle={{ padding: 4 }}
            titleVariant="labelSmall"
          />
        </Card>
      }>
      <Menu.Item
        title="Edit"
        onPress={openWebPage}
        leadingIcon={({ color, size }) => (
          <Ionicons name="pencil-outline" color={color} size={size} />
        )}
      />
      <Menu.Item
        title="Delete"
        onPress={handleDelete}
        leadingIcon={({ color, size }) => (
          <Ionicons name="trash-outline" color={color} size={size} />
        )}
      />
    </Menu>
  );
}
