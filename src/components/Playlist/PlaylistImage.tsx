import { Icon, useTheme } from "@ui-kitten/components";
import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import ContextMenu from "react-native-context-menu-view";
import { TouchableOpacity } from "react-native-gesture-handler";

import { storage } from "@/src/utils/mmkv";

interface Props {
  uri?: string;
  onPress?: () => void;
  existingShowId?: string;
}

export default function PlaylistImage({ uri, onPress, existingShowId }: Props) {
  const theme = useTheme();

  const removePlaylistImage = () => {
    if (!uri || !existingShowId) return;

    storage.delete(`upcoming-show-${existingShowId}-image`);
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={() => null}
      containerStyle={{
        borderRadius: 10,
        borderWidth: 1,
        borderColor: theme["border-basic-color-5"],
      }}>
      {uri ? (
        <ContextMenu
          actions={uri ? [{ title: "Remove", destructive: true }] : []}
          onPress={removePlaylistImage}>
          <Image
            source={{
              uri,
              width: styles.image.width,
              height: styles.image.height,
            }}
            contentFit="cover"
            style={styles.image}
            transition={1000}
          />
        </ContextMenu>
      ) : (
        <Icon
          name="music"
          fill={theme["text-hint-color"]}
          style={[
            styles.image,
            {
              backgroundColor: theme["background-basic-color-2"],
            },
          ]}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 75,
    height: 75,
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
