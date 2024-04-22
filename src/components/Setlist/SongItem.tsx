import { Ionicons } from "@expo/vector-icons";
import { openBrowserAsync } from "expo-web-browser";
import { useState } from "react";
import { Gesture, GestureDetector, TouchableOpacity } from "react-native-gesture-handler";
import { List, Menu, IconButton, Avatar, Text } from "react-native-paper";

import { Song } from "@/src/utils/setlist-fm-types";
import { Image } from "@/src/utils/spotify-types";

interface Props {
  item: Song;
  loading: boolean;
  image: Image | null | undefined;
  link: string | null | undefined;
}

export default function SongItem({ item, loading, image, link }: Props) {
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
