import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button, Card, IconButton, Snackbar, Text } from "react-native-paper";

import CreatedPlaylistItem from "@/src/components/Playlist/CreatedPlaylistItem";
import UpcomingShowItem from "@/src/components/UpcomingShow/UpcomingShowItem";
import UpcomingShowModal from "@/src/components/UpcomingShow/UpcomingShowModal";
import InfoDialog from "@/src/components/ui/InfoDialog";
import useCreatedPlaylist from "@/src/hooks/useCreatedPlaylist";
import useUpcomingShows from "@/src/hooks/useUpcomingShows";

export default function Profile() {
  const { playlists } = useCreatedPlaylist({});
  const { upcomingShows } = useUpcomingShows();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [infoDialogVisible, setInfoDialogVisible] = useState<boolean>(false);

  return (
    <View style={{ flex: 1 }}>
      <Text variant="headlineSmall" style={{ textAlign: "left", paddingTop: 16, paddingLeft: 16 }}>
        My Playlists
      </Text>
      {playlists.length === 0 ? (
        <Card style={{ margin: 8 }}>
          <Card.Actions>
            <Text>Check out some setlists to get started!</Text>
            <Button mode="outlined" onPress={() => router.replace("/explore")}>
              Explore
            </Button>
          </Card.Actions>
        </Card>
      ) : (
        <FlashList
          horizontal
          showsHorizontalScrollIndicator={false}
          estimatedItemSize={200}
          contentContainerStyle={{ padding: 8 }}
          data={playlists}
          renderItem={({ item }) => (
            <CreatedPlaylistItem playlist={item} showSnackbar={() => setSnackbarVisible(true)} />
          )}
        />
      )}
      <TouchableOpacity>
        <Button
          icon={({ color, size }) => <Ionicons name="arrow-forward" color={color} size={size} />}
          // TODO: create created-playlists page
          style={{ alignSelf: "flex-end" }}
          contentStyle={{ flexDirection: "row-reverse" }}>
          View All
        </Button>
      </TouchableOpacity>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text
          variant="headlineSmall"
          style={{
            textAlign: "left",
            paddingLeft: 16,
          }}>
          My Upcoming Shows
        </Text>
        <IconButton
          icon={({ color, size }) => <Ionicons name="add-circle" color={color} size={size} />}
          onPress={() => setModalVisible(true)}
        />
      </View>
      <FlashList
        estimatedItemSize={100}
        data={upcomingShows}
        renderItem={({ item }) => <UpcomingShowItem show={item} />}
      />

      {modalVisible && <UpcomingShowModal visible={modalVisible} setVisible={setModalVisible} />}
      {infoDialogVisible && (
        <InfoDialog
          visible={infoDialogVisible}
          setVisible={setInfoDialogVisible}
          title="About Spotify's Web API">
          Spotify's API doesn't allow us to remotely delete playlists - you are only deleting them
          from our own database. To fully delete the playlist, please go to the Spotify app.
        </InfoDialog>
      )}

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: "Learn More",
          onPress: () => setInfoDialogVisible(true),
        }}>
        Playlist deleted from On Tour!
      </Snackbar>
    </View>
  );
}
