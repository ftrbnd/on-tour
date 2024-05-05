import { useQuery } from "@tanstack/react-query";
import { Icon, Layout, Popover, Text, useTheme } from "@ui-kitten/components";
import { Image } from "expo-image";
import { openBrowserAsync } from "expo-web-browser";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import useCreatedPlaylists from "../../hooks/useCreatedPlaylists";
import { CreatedPlaylist } from "../../services/createdPlaylists";
import SwipeableItem from "../ui/SwipeableItem";

import { PlaylistIcon } from "@/src/assets/icons";
import { useAuth } from "@/src/providers/AuthProvider";
import { getOnePlaylist } from "@/src/services/spotify";
import { Playlist, TrackItem } from "@/src/utils/spotify-types";

interface Props {
  playlist: CreatedPlaylist;
  horizontal?: boolean;
}

interface ItemProps extends Props {
  openWebPage: () => void;
  handleDelete: () => void;
  spotifyPlaylist: Playlist<TrackItem> | undefined;
  popoverVisible: boolean;
  setPopoverVisible: (v: boolean) => void;
}

const BORDER_RADIUS = 10;

function VerticalPlaylistItem({
  playlist,
  openWebPage,
  handleDelete,
  spotifyPlaylist,
  popoverVisible,
  setPopoverVisible,
}: ItemProps) {
  const theme = useTheme();

  const renderToggleItemCard = () => (
    <TouchableOpacity onPress={openWebPage} onLongPress={() => setPopoverVisible(true)}>
      <Layout
        style={{
          height: 250,
          width: 200,
          margin: 8,
          borderRadius: BORDER_RADIUS,
          borderWidth: 1,
          borderColor: theme["border-basic-color-4"],
        }}>
        <Image
          source={spotifyPlaylist ? { uri: spotifyPlaylist.images[0].url } : PlaylistIcon}
          style={{
            height: 200,
            width: 200,
            borderTopLeftRadius: BORDER_RADIUS,
            borderTopRightRadius: BORDER_RADIUS,
          }}
        />

        <Text
          numberOfLines={2}
          style={{
            paddingVertical: 4,
            paddingHorizontal: 8,
          }}>
          {playlist.title}
        </Text>
      </Layout>
    </TouchableOpacity>
  );

  return (
    <Popover
      animationType="fade"
      visible={popoverVisible}
      onBackdropPress={() => setPopoverVisible(false)}
      anchor={renderToggleItemCard}>
      <View style={{ borderRadius: BORDER_RADIUS }}>
        <View style={styles.popoverItem}>
          <Icon
            name="edit-outline"
            style={{ height: 24, width: 24 }}
            fill={theme["text-basic-color"]}
          />
          <Text onPress={openWebPage}>Edit</Text>
        </View>

        <View style={styles.popoverItem}>
          <Icon
            name="trash-outline"
            style={{ height: 24, width: 24 }}
            fill={theme["text-basic-color"]}
          />
          <Text onPress={handleDelete}>Delete</Text>
        </View>
      </View>
    </Popover>
  );
}

function HorizontalPlaylistItem({
  playlist,
  openWebPage,
  handleDelete,
  spotifyPlaylist,
}: ItemProps) {
  const parsedDescription = spotifyPlaylist?.description.replaceAll("&#x2F;", "/") ?? "";

  return (
    <Layout style={{ marginVertical: 8, borderRadius: BORDER_RADIUS }}>
      <SwipeableItem onEdit={openWebPage} onDelete={handleDelete}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderRadius: BORDER_RADIUS,
          }}>
          <Image
            source={
              spotifyPlaylist
                ? { uri: spotifyPlaylist.images[0].url, height: 100, width: 100 }
                : PlaylistIcon
            }
            style={{
              borderTopLeftRadius: BORDER_RADIUS,
              borderBottomLeftRadius: BORDER_RADIUS,
              height: 100,
              width: 100,
            }}
          />
          <View style={{ flex: 1 }}>
            <Text
              category="h6"
              numberOfLines={2}
              style={{ flex: 1, paddingHorizontal: 8, paddingTop: 8 }}>
              {playlist.title}
            </Text>
            <Text
              category="c2"
              numberOfLines={2}
              style={{ flex: 1, paddingHorizontal: 8, paddingBottom: 8 }}>
              {parsedDescription}
            </Text>
          </View>
        </View>
      </SwipeableItem>
    </Layout>
  );
}

export default function CreatedPlaylistItem(props: Props) {
  const [popoverVisible, setPopoverVisible] = useState<boolean>(false);

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
      popoverVisible={popoverVisible}
      setPopoverVisible={setPopoverVisible}
    />
  ) : (
    <VerticalPlaylistItem
      {...props}
      openWebPage={openWebPage}
      handleDelete={handleDelete}
      spotifyPlaylist={spotifyPlaylist}
      popoverVisible={popoverVisible}
      setPopoverVisible={setPopoverVisible}
    />
  );
}

const styles = StyleSheet.create({
  popoverItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 4,
  },
});
