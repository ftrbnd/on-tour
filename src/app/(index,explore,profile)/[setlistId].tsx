import { randomUUID } from "expo-crypto";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Button, Text } from "react-native-paper";

import CreatePlaylistModal from "@/src/components/CreatePlaylistModal";
import useSetlist from "@/src/hooks/useSetlist";
import { createPlaylistName } from "@/src/utils/helpers";

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  list: {
    padding: 8,
  },
});

export default function SetlistPage() {
  const { setlistId }: { setlistId: string } = useLocalSearchParams();
  const { data: setlist, primary, encore, openWebpage } = useSetlist(setlistId);

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: createPlaylistName(setlist) }} />

      <Text>Setlist</Text>
      <FlatList
        style={styles.list}
        data={primary?.song}
        renderItem={({ item }) => <Text>{item.name}</Text>}
        keyExtractor={(song) => `${song.name}-${randomUUID()}`}
      />

      {encore && (
        <>
          <Text>Encore</Text>
          <FlatList
            style={styles.list}
            data={encore?.song}
            renderItem={({ item }) => <Text>{item.name}</Text>}
            keyExtractor={(song) => `${song.name}-${randomUUID()}`}
          />
        </>
      )}

      {setlist && (
        <CreatePlaylistModal
          visible={modalVisible}
          setVisible={setModalVisible}
          setlistId={setlistId}
        />
      )}

      <Button onPress={() => openWebpage()}>View on setlist.fm</Button>
      <Button onPress={() => setModalVisible(true)}>Create Playlist</Button>
    </View>
  );
}
