import { Icon, Text } from "@ui-kitten/components";
import { Image } from "expo-image";
import { openBrowserAsync } from "expo-web-browser";
import ContextMenu from "react-native-context-menu-view";
import { TouchableOpacity } from "react-native-gesture-handler";

import LoadingIndicator from "../ui/LoadingIndicator";

import { Song } from "@/src/utils/setlist-fm-types";
import { Image as SpotifyImage } from "@/src/utils/spotify-types";

interface Props {
  item: Song;
  loading: boolean;
  image?: SpotifyImage | null;
  link?: string | null;
}

export default function SongItem({ item, loading, image, link }: Props) {
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
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          paddingHorizontal: 8,
          paddingVertical: 16,
        }}>
        {loading ? (
          <LoadingIndicator size="large" />
        ) : image ? (
          <Image source={{ uri: image.url }} style={{ height: 48, width: 48, borderRadius: 25 }} />
        ) : (
          <Icon name="music-outline" style={{ height: 48, width: 48 }} />
        )}
        <Text category="s1">{item.name}</Text>
      </TouchableOpacity>
    </ContextMenu>
  );
}
