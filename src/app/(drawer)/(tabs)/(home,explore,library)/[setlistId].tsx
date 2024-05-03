import { Icon, Layout } from "@ui-kitten/components";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { FAB } from "react-native-paper";

import CreatePlaylistModal from "@/src/components/Playlist/CreatePlaylistModal";
import PlaylistExistsModal from "@/src/components/Playlist/PlaylistExistsModal";
import ParallaxSongsList from "@/src/components/Song/ParallaxSongsList";
import InfoDialog from "@/src/components/ui/InfoDialog";
import useCreatedPlaylists from "@/src/hooks/useCreatedPlaylists";

export default function SetlistPage() {
  const { setlistId, isUpcomingShow }: { setlistId: string; isUpcomingShow?: "true" | "false" } =
    useLocalSearchParams();
  const { playlists } = useCreatedPlaylists(null, setlistId);

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

      <Layout level="2" style={{ flex: 1 }}>
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
            isUpcomingShow={isUpcomingShow}
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

        <FAB
          variant={isUpcomingShow === "true" ? "tertiary" : "secondary"}
          icon={({ color }) => (
            <Icon name="cloud-upload-outline" style={{ height: 24, width: 24 }} color={color} />
          )}
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        />
      </Layout>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
