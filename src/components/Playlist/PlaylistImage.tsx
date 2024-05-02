import { Icon, useTheme } from "@ui-kitten/components";
import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface Props {
  showImage: boolean;
  uri?: string;
  onPress?: () => void;
}

export default function PlaylistImage({ showImage, uri, onPress }: Props) {
  const theme = useTheme();

  return showImage ? (
    <Image
      onTouchStart={onPress}
      source={{
        uri,
        width: styles.image.width,
        height: styles.image.height,
      }}
      contentFit="cover"
      style={styles.image}
      transition={1000}
    />
  ) : (
    // TODO: onPress doesn't register
    <TouchableOpacity
      onPress={onPress}
      style={[styles.image, { backgroundColor: theme["color-primary-200"] }]}>
      <Icon
        name="music"
        style={{
          color: theme["color-primary-200"],
          height: styles.image.height * 0.66,
          width: styles.image.width * 0.66,
        }}
      />
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
