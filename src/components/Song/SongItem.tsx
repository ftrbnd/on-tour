import { Icon, Text, useTheme } from "@ui-kitten/components";
import { Image } from "expo-image";
import { openBrowserAsync } from "expo-web-browser";
import { Skeleton } from "moti/skeleton";
import { Pressable } from "react-native";
import ContextMenu from "react-native-context-menu-view";

import { Song } from "@/src/utils/setlist-fm-types";
import { Image as SpotifyImage } from "@/src/utils/spotify-types";

interface Props {
  item: Song;
  loading: boolean;
  image?: SpotifyImage | null;
  link?: string | null;
}

export default function SongItem({ item, loading, image, link }: Props) {
  const theme = useTheme();

  const openSongLink = async () => {
    try {
      if (link) await openBrowserAsync(link);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ContextMenu
      actions={[{ title: link ? "View on Spotify" : "Track not found", disabled: !link }]}
      onPress={openSongLink}>
      <Pressable
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          paddingHorizontal: 8,
          paddingVertical: 16,
        }}>
        {loading ? (
          <Skeleton
            radius="round"
            height={48}
            width={48}
            colors={[theme["background-basic-color-2"], theme["background-basic-color-4"]]}
          />
        ) : image ? (
          <Image source={{ uri: image.url }} style={{ height: 48, width: 48, borderRadius: 25 }} />
        ) : (
          <Icon name="music-outline" style={{ height: 48, width: 48 }} />
        )}
        <Text category="s1">{item.name}</Text>
      </Pressable>
    </ContextMenu>
  );
}
