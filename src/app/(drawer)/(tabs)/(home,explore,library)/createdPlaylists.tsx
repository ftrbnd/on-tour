import { FlashList } from "@shopify/flash-list";
import { Card, Icon, Layout, Text, useTheme } from "@ui-kitten/components";
import { Stack, router } from "expo-router";
import { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { withDetailsHeaderFlashList } from "react-native-sticky-parallax-header";

import { PlaylistIcon } from "@/src/assets/icons";
import CreatedPlaylistItem from "@/src/components/Playlist/CreatedPlaylistItem";
import InfoDialog from "@/src/components/ui/InfoDialog";
import useCreatedPlaylists from "@/src/hooks/useCreatedPlaylists";
import { CreatedPlaylist } from "@/src/services/createdPlaylists";

const DetailsHeaderFlashList = withDetailsHeaderFlashList<CreatedPlaylist>(FlashList);

export default function CreatedPlaylistsPage() {
  const [infoDialogVisible, setInfoDialogVisible] = useState<boolean>(false);
  const insets = useSafeAreaInsets();

  const { playlists } = useCreatedPlaylists();
  const theme = useTheme();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <Layout style={{ flex: 1, marginTop: -insets.top }}>
        <DetailsHeaderFlashList
          parallaxHeight={100}
          hasBorderRadius
          leftTopIcon={() => (
            <TouchableOpacity>
              <Icon
                name="chevron-left-outline"
                fill={theme["text-control-color"]}
                style={{ height: 24, width: 24 }}
              />
            </TouchableOpacity>
          )}
          leftTopIconOnPress={router.back}
          rightTopIcon={() => (
            <TouchableOpacity>
              <Icon
                name="info-outline"
                fill={theme["text-control-color"]}
                style={{ height: 24, width: 24 }}
              />
            </TouchableOpacity>
          )}
          rightTopIconOnPress={() => setInfoDialogVisible(true)}
          backgroundColor={theme["color-primary-default"]}
          containerStyle={{ backgroundColor: theme["background-basic-color-2"] }}
          contentIcon={PlaylistIcon}
          contentIconNumber={playlists.length}
          contentIconNumberStyle={{ color: "#000" }}
          tagStyle={{ display: "none" }}
          title="My Playlists"
          subtitle=""
          estimatedItemSize={100}
          contentContainerStyle={{ padding: 8 }}
          data={playlists}
          renderItem={({ item }) => <CreatedPlaylistItem playlist={item} horizontal />}
          ListEmptyComponent={
            <Card style={{ marginTop: 8 }}>
              <Text category="s2" style={{ textAlign: "center" }}>
                You have no playlists.
              </Text>
            </Card>
          }
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
      </Layout>
    </>
  );
}
