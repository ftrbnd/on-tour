import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Stack, router } from "expo-router";
import { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Snackbar, useTheme } from "react-native-paper";
import { withDetailsHeaderFlashList } from "react-native-sticky-parallax-header";

import { PlaylistIcon } from "@/src/assets/icons";
import CreatedPlaylistItem from "@/src/components/Playlist/CreatedPlaylistItem";
import InfoDialog from "@/src/components/ui/InfoDialog";
import useCreatedPlaylists from "@/src/hooks/useCreatedPlaylists";
import { CreatedPlaylist } from "@/src/services/createdPlaylists";

const DetailsHeaderFlashList = withDetailsHeaderFlashList<CreatedPlaylist>(FlashList);

export default function CreatedPlaylistsPage() {
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [infoDialogVisible, setInfoDialogVisible] = useState<boolean>(false);

  const { playlists } = useCreatedPlaylists();
  const theme = useTheme();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <DetailsHeaderFlashList
        parallaxHeight={100}
        hasBorderRadius
        leftTopIcon={() => (
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={24} color={theme.colors.onSecondaryContainer} />
          </TouchableOpacity>
        )}
        leftTopIconOnPress={router.back}
        backgroundColor={theme.colors.secondaryContainer}
        containerStyle={{ backgroundColor: theme.colors.surface }}
        contentIcon={PlaylistIcon}
        contentIconNumber={playlists.length}
        contentIconNumberStyle={{ color: "#000" }}
        tagStyle={{ display: "none" }}
        title="My Playlists"
        subtitle=""
        titleStyle={{ color: theme.colors.onSecondaryContainer }}
        estimatedItemSize={100}
        contentContainerStyle={{ padding: 8 }}
        data={playlists}
        renderItem={({ item }) => <CreatedPlaylistItem playlist={item} horizontal />}
      />

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
    </>
  );
}
