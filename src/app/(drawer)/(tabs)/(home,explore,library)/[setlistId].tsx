import { Button, Icon, Layout, useTheme } from "@ui-kitten/components";
import { Stack, useLocalSearchParams } from "expo-router";
import { Platform, StyleSheet } from "react-native";
import { SheetManager } from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ParallaxSongsList from "@/src/components/Song/ParallaxSongsList";
import FocusAwareStatusBar from "@/src/components/ui/FocusAwareStatusBar";
import useCreatedPlaylists from "@/src/hooks/useCreatedPlaylists";

export default function SetlistPage() {
  const { setlistId, upcomingShowId }: { setlistId: string; upcomingShowId?: string } =
    useLocalSearchParams();
  const { playlists } = useCreatedPlaylists();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const playlistExists = playlists.some((playlist) => playlist.setlistId === setlistId);

  const openSheet = async () =>
    playlistExists
      ? await SheetManager.show("playlist-exists-sheet", {
          payload: {
            playlistId: playlists[0].id,
            playlistTitle: playlists[0].title,
          },
        })
      : await SheetManager.show("create-playlist-sheet", {
          payload: {
            setlistId,
            upcomingShowId,
          },
        });

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <FocusAwareStatusBar backgroundColor={theme["color-primary-default"]} style="light" />

      <Layout level="2" style={{ flex: 1, marginTop: -insets.top }}>
        <ParallaxSongsList setlistId={setlistId} />

        <Button
          accessoryLeft={<Icon name="cloud-upload-outline" />}
          style={[styles.fab, Platform.OS === "android" ? styles.android : styles.ios]}
          onPress={openSheet}
        />
      </Layout>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 0,
    bottom: 0,
    margin: 16,
    height: 65,
    width: 65,
    borderRadius: 65,
  },
  android: {
    elevation: 4,
    shadowColor: "#171717",
  },
  ios: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
