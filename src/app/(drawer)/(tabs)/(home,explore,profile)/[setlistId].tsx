import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import moment from "moment";
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Card, FAB, Text, useTheme } from "react-native-paper";

import CreatePlaylistModal from "@/src/components/Playlist/CreatePlaylistModal";
import PlaylistExistsModal from "@/src/components/Playlist/PlaylistExistsModal";
import SongsList from "@/src/components/Setlist/SongsList";
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
  const { playlistExists } = useCreatedPlaylist({ setlistId });
  const theme = useTheme();

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Setlist",
          headerBackVisible: true,
          headerLeft: () => null,
          headerRight: () => (
            <TouchableOpacity onPress={() => setlist.openWebpage()}>
              <Ionicons name="open-outline" size={24} color={theme.colors.onPrimaryContainer} />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.container}>
        <Card style={{ ...styles.card, backgroundColor: theme.colors.secondaryContainer }}>
          <TouchableOpacity style={{ paddingBottom: 16 }}>
            {setlist.data?.artist && (
              <Card.Title
                title={setlist.data.artist.name}
                titleStyle={styles.cardTitle}
                subtitle={setlist.data.tour?.name}
                subtitleStyle={setlist.data.tour ? styles.cardTitle : null}
              />
            )}
            <Card.Content style={styles.cardContent}>
              <View style={styles.detail}>
                <FontAwesome5 name="building" size={24} color={theme.colors.onSecondaryContainer} />
                <Text>{`${setlist.data?.venue.name}`}</Text>
              </View>
              <View style={styles.detail}>
                <FontAwesome5 name="city" size={24} color={theme.colors.onSecondaryContainer} />
                <Text>{`${setlist.data?.venue.city.name}, ${setlist.data?.venue.city.state}, ${setlist.data?.venue.city.country.code}`}</Text>
              </View>
              <View style={styles.detail}>
                <FontAwesome5
                  name="calendar-day"
                  size={24}
                  color={theme.colors.onSecondaryContainer}
                />
                <Text>{moment(setlist.data?.eventDate, "DD-MM-YYYY").format("MMMM Do, YYYY")}</Text>
              </View>
            </Card.Content>
          </TouchableOpacity>
        </Card>

        <SongsList setlistId={setlistId} />

        {setlist && playlistExists && playlistExists.length > 0 ? (
          <PlaylistExistsModal
            visible={modalVisible}
            setVisible={setModalVisible}
            playlistId={playlistExists[0].id}
            playlistTitle={playlistExists[0].title}
          />
        ) : (
          <CreatePlaylistModal
            visible={modalVisible}
            setVisible={setModalVisible}
            setlistId={setlistId}
          />
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
