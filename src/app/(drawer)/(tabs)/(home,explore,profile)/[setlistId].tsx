import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { FAB } from "react-native-paper";

import CreatePlaylistModal from "@/src/components/Playlist/CreatePlaylistModal";
import PlaylistExistsModal from "@/src/components/Playlist/PlaylistExistsModal";
import ParallaxSongsList from "@/src/components/Setlist/ParallaxSongsList";
import InfoDialog from "@/src/components/ui/InfoDialog";
import useCreatedPlaylist from "@/src/hooks/useCreatedPlaylist";
import useSetlist from "@/src/hooks/useSetlist";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    justifyContent: "flex-start",
  },
  card: {
    margin: 8,
  },
  cardTitle: { fontWeight: "bold", textAlign: "center" },
  cardContent: {
    display: "flex",
    gap: 8,
  },
  detail: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default function SetlistPage() {
  const { setlistId }: { setlistId: string } = useLocalSearchParams();
  const setlist = useSetlist(setlistId);
  const { playlists } = useCreatedPlaylist({ setlistId });

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.container}>
        <ParallaxSongsList setlistId={setlistId} setDialogVisible={setDialogVisible} />

        {setlist && playlists.length > 0 ? (
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
          variant="secondary"
          icon={({ color }) => <Ionicons name="cloud-upload" size={24} color={color} />}
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        />
      </View>
    </>
  );
}
