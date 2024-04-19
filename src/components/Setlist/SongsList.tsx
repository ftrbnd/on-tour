import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { openBrowserAsync } from "expo-web-browser";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Divider, List, Menu, IconButton, Avatar, Text } from "react-native-paper";

import useSetlist from "@/src/hooks/useSetlist";
import { Song } from "@/src/utils/setlist-fm-types";
import { Image } from "@/src/utils/spotify-types";

interface SongItemProps {
  item: Song;
  loading: boolean;
  image: Image | null | undefined;
  link: string | null | undefined;
}

function SongItem({ item, loading, image, link }: SongItemProps) {
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [menuMessage, setMenuMessage] = useState<string>("");

  const tap = Gesture.Tap()
    .runOnJS(true)
    .onEnd(() => {
      setMenuVisible(true);
      setMenuMessage(link ? "View on Spotify" : "Track not found");
    });

  const openSongLink = async () => {
    try {
      if (link) await openBrowserAsync(link);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <GestureDetector gesture={tap}>
      <TouchableOpacity>
        <List.Item
          title={() => (
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={<Text variant="titleMedium">{item.name}</Text>}>
              <Menu.Item
                leadingIcon={({ color, size }) => (
                  <Ionicons
                    name={link ? "open-outline" : "alert-circle-outline"}
                    color={color}
                    size={size}
                  />
                )}
                onPress={() => (link ? openSongLink() : null)}
                title={menuMessage}
                disabled={!link}
              />
            </Menu>
          )}
          left={() =>
            loading ? (
              <IconButton size={24} loading={loading} icon="loading" disabled />
            ) : image ? (
              <Avatar.Image size={48} source={{ uri: image.url }} />
            ) : (
              <List.Icon
                icon={({ color }) => <Ionicons name="musical-note" size={48} color={color} />}
              />
            )
          }
        />
      </TouchableOpacity>
    </GestureDetector>
  );
}

export default function SongsList({ setlistId }: { setlistId: string }) {
  const setlist = useSetlist(setlistId);

  return (
    <FlashList
      estimatedItemSize={75}
      contentContainerStyle={{ padding: 8 }}
      data={setlist.songs}
      renderItem={({ item, index }) => (
        <SongItem
          item={item}
          loading={setlist.spotifyTracksLoading}
          image={setlist.spotifyTracks
            ?.map((track) => (track ? track.album.images[0] : null))
            .at(index)}
          link={setlist.spotifyTracks
            .map((track) => (track ? track.external_urls.spotify : null))
            .at(index)}
        />
      )}
      ItemSeparatorComponent={() => <Divider />}
    />
  );
}
