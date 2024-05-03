import { Button, Icon, Text, useTheme } from "@ui-kitten/components";
import { openBrowserAsync } from "expo-web-browser";
import { View } from "react-native";
import { useMMKVString } from "react-native-mmkv";

import PlaylistImage from "./PlaylistImage";
import FormattedModal from "../ui/FormattedModal";

interface Props {
  visible: boolean;
  setVisible: (vis: boolean) => void;
  playlistId: string | null;
  playlistTitle: string;
}

export default function PlaylistExistsModal({
  visible,
  setVisible,
  playlistId,
  playlistTitle,
}: Props) {
  const [playlistImage] = useMMKVString(`playlist-${playlistId}-image`);
  const theme = useTheme();

  const openWebPage = async () => {
    try {
      if (playlistId) await openBrowserAsync(`https://open.spotify.com/playlist/${playlistId}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormattedModal
      visible={visible}
      setVisible={setVisible}
      header={
        <>
          <View />
          <PlaylistImage showImage={playlistImage !== undefined} uri={playlistImage} />
          <View />
        </>
      }
      body={
        <Text category="s1" style={{ fontWeight: "bold", textAlign: "center" }}>
          {playlistTitle}
        </Text>
      }
      footer={
        <Button
          appearance="filled"
          onPress={openWebPage}
          accessoryLeft={() => (
            <Icon
              name="external-link-outline"
              style={{ height: 24, width: 24 }}
              fill={theme["text-basic-color"]}
            />
          )}>
          View your playlist
        </Button>
      }
    />
  );
}
