import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { openBrowserAsync } from "expo-web-browser";
import { useState } from "react";
import { View } from "react-native";
import { Card, Menu, Surface, Text } from "react-native-paper";

import useCreatedPlaylists from "../../hooks/useCreatedPlaylists";
import { CreatedPlaylist } from "../../services/createdPlaylists";
import SwipeableItem from "../ui/SwipeableItem";

import { PlaylistIcon } from "@/src/assets/icons";
import { useAuth } from "@/src/providers/AuthProvider";
import { getOnePlaylist } from "@/src/services/spotify";
import { Playlist, TrackItem } from "@/src/utils/spotify-types";

interface Props {
  playlist: CreatedPlaylist;
  showSnackbar?: () => void;
  horizontal?: boolean;
}

interface ItemProps extends Props {
  openWebPage: () => void;
  handleDelete: () => void;
  spotifyPlaylist: Playlist<TrackItem> | undefined;
  menuVisible: boolean;
  setMenuVisible: (v: boolean) => void;
}

function VerticalPlaylistItem({
  playlist,
  openWebPage,
  handleDelete,
  spotifyPlaylist,
  menuVisible,
  setMenuVisible,
}: ItemProps) {
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

function HorizontalPlaylistItem({
  playlist,
  openWebPage,
  handleDelete,
  spotifyPlaylist,
}: ItemProps) {
  return (
    <Surface style={{ margin: 8, borderRadius: 10 }}>
      <SwipeableItem onEdit={openWebPage} onDelete={handleDelete}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}>
          <Image
            source={
              spotifyPlaylist
                ? { uri: spotifyPlaylist.images[0].url, height: 100, width: 100 }
                : PlaylistIcon
            }
            style={{ borderTopLeftRadius: 10, borderBottomLeftRadius: 10, height: 100, width: 100 }}
          />
          <Text variant="labelMedium" numberOfLines={2} style={{ flex: 1, padding: 8 }}>
            {playlist.title}
          </Text>
        </View>
      </SwipeableItem>
    </Surface>
  );
}

export default function CreatedPlaylistItem(props: Props) {
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  const { session } = useAuth();

  const { data: spotifyPlaylist } = useQuery({
    queryKey: ["playlists", props.playlist.id],
    queryFn: () => getOnePlaylist(session?.accessToken, props.playlist.id),
    enabled: session !== null,
  });
  const { removeFromDatabase } = useCreatedPlaylists(props.playlist.id);

  const openWebPage = async () => {
    try {
      if (props.playlist)
        await openBrowserAsync(`https://open.spotify.com/playlist/${props.playlist.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await removeFromDatabase();
      if (props.showSnackbar) props.showSnackbar();
    } catch (e) {
      console.error(e);
    }
  };

  return props.horizontal ? (
    <HorizontalPlaylistItem
      {...props}
      openWebPage={openWebPage}
      handleDelete={handleDelete}
      spotifyPlaylist={spotifyPlaylist}
      menuVisible={menuVisible}
      setMenuVisible={setMenuVisible}
    />
  ) : (
    <VerticalPlaylistItem
      {...props}
      openWebPage={openWebPage}
      handleDelete={handleDelete}
      spotifyPlaylist={spotifyPlaylist}
      menuVisible={menuVisible}
      setMenuVisible={setMenuVisible}
    />
  );
}
