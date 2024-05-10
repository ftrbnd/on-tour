import { useQuery } from "@tanstack/react-query";
import { Button, Icon, Text, useTheme } from "@ui-kitten/components";
import { openBrowserAsync } from "expo-web-browser";
import { View } from "react-native";
import { useSheetPayload } from "react-native-actions-sheet";

import PlaylistImage from "./PlaylistImage";
import FormattedSheet from "../ui/FormattedSheet";

import { useAuth } from "@/src/providers/AuthProvider";
import { getOnePlaylist } from "@/src/services/spotify";

export default function PlaylistExistsSheet() {
  const { playlistId, playlistTitle } = useSheetPayload("playlist-exists-sheet");
  const { session } = useAuth();

  const { data: spotifyPlaylist } = useQuery({
    queryKey: ["playlists", playlistId],
    queryFn: () => getOnePlaylist(session?.accessToken, playlistId),
    enabled: session !== null && playlistId !== null,
  });

  const playlistImage = spotifyPlaylist?.images[1].url;

  const theme = useTheme();

  const openWebPage = async () => {
    try {
      if (playlistId) await openBrowserAsync(`https://open.spotify.com/playlist/${playlistId}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormattedSheet
      header={
        <>
          <View />
          <PlaylistImage uri={playlistImage} />
          <View />
        </>
      }
      body={
        <Text category="s1" style={{ fontWeight: "bold", textAlign: "center" }}>
          {playlistTitle}
        </Text>
      }
      footer={
        <Button
          appearance="filled"
          onPress={openWebPage}
          accessoryLeft={() => (
            <Icon
              name="external-link-outline"
              style={{ height: 24, width: 24 }}
              fill={theme["color-primary-100"]}
            />
          )}>
          View your playlist
        </Button>
      }
    />
  );
}
