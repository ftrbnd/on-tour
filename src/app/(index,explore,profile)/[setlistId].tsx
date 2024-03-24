import { useQuery } from "@tanstack/react-query";
import { randomUUID } from "expo-crypto";
import { Stack, useLocalSearchParams } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Button, Text } from "react-native-paper";

import CreatePlaylistModal from "@/src/components/CreatePlaylistModal";
import { getOneSetlist } from "@/src/services/setlist-fm";
import { BasicSet } from "@/src/utils/setlist-fm-types";

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

  const [primary, setPrimary] = useState<BasicSet | null>(null);
  const [encore, setEncore] = useState<BasicSet | null>(null);

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { data: setlist } = useQuery({
    queryKey: ["setlist", setlistId],
    queryFn: () => getOneSetlist(setlistId),
    enabled: setlistId !== null,
  });

  useEffect(() => {
    if (setlist) {
      setPrimary(setlist.sets.set[0]);
      setEncore(setlist.sets.set[1]);
    }
  }, [setlist]);

  const openSetlistFmPage = async () => {
    try {
      if (setlist) await openBrowserAsync(setlist.url);
    } catch (error) {
      console.error(error);
    }
  };

  const createPlaylistName = () => {
    if (!setlist) return "";

    const location = setlist.tour ? setlist.tour.name : setlist.venue.name;

    return `${setlist.artist.name} - ${location}`;
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: createPlaylistName() }} />

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
          setlist={setlist}
          primary={primary}
          encore={encore}
          playlistName={createPlaylistName()}
        />
      )}

      <Button onPress={openSetlistFmPage}>View on setlist.fm</Button>
      <Button onPress={() => setModalVisible(true)}>Create Playlist</Button>
    </View>
  );
}
