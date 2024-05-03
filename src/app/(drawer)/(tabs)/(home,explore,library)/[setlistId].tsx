import { Button, Icon, Layout } from "@ui-kitten/components";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CreatePlaylistModal from "@/src/components/Playlist/CreatePlaylistModal";
import PlaylistExistsModal from "@/src/components/Playlist/PlaylistExistsModal";
import ParallaxSongsList from "@/src/components/Song/ParallaxSongsList";
import InfoDialog from "@/src/components/ui/InfoDialog";
import useCreatedPlaylists from "@/src/hooks/useCreatedPlaylists";

export default function SetlistPage() {
  const { setlistId, isUpcomingShow }: { setlistId: string; isUpcomingShow?: "true" | "false" } =
    useLocalSearchParams();
  const { playlists } = useCreatedPlaylists(null, setlistId);
  const insets = useSafeAreaInsets();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);

  const playlistExists = playlists.some((playlist) => playlist.setlistId === setlistId);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <Layout level="2" style={{ flex: 1, marginTop: -insets.top }}>
        <ParallaxSongsList setlistId={setlistId} setDialogVisible={setDialogVisible} />

        {playlistExists ? (
          <PlaylistExistsModal
            visible={modalVisible}
            setVisible={setModalVisible}
            playlistId={playlists[0].id}
            playlistTitle={playlists[0].title}
          />
        ) : (
          <CreatePlaylistModal
            visible={modalVisible}
            setVisible={setModalVisible}
            setlistId={setlistId}
            isUpcomingShow={isUpcomingShow === "true"}
          />
        )}

        {dialogVisible && (
          <InfoDialog
            visible={dialogVisible}
            setVisible={setDialogVisible}
            title="Not the artist you were expecting?">
            On Tour searches for setlists through setlist.fm, and will match with any artists whose
            names are similar.
          </InfoDialog>
        )}

        <Button
          accessoryLeft={<Icon name="cloud-upload-outline" />}
          style={[styles.fab, Platform.OS === "android" ? styles.android : styles.ios]}
          onPress={() => setModalVisible(true)}
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
