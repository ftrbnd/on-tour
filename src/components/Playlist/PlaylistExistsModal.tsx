import { Entypo } from "@expo/vector-icons";
import { openBrowserAsync } from "expo-web-browser";
import { View } from "react-native";
import { useMMKVString } from "react-native-mmkv";
import { Button, Text } from "react-native-paper";

import PlaylistImage from "./PlaylistImage";
import AnimatedModal from "../ui/AnimatedModal";

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

  const openWebPage = async () => {
    try {
      if (playlistId) await openBrowserAsync(`https://open.spotify.com/playlist/${playlistId}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AnimatedModal
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
        <Text variant="labelLarge" style={{ fontWeight: "bold", textAlign: "center" }}>
          {playlistTitle}
        </Text>
      }
      footer={
        <Button
          mode="contained"
          onPress={openWebPage}
          icon={({ color }) => <Entypo name="spotify" size={24} color={color} />}>
          View your playlist
        </Button>
      }
    />
  );
}
