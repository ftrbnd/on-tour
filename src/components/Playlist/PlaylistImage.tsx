import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTheme } from "react-native-paper";

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
    <TouchableOpacity
      onPress={onPress}
      style={[styles.image, { backgroundColor: theme.colors.surfaceVariant }]}>
      <Ionicons
        name="musical-notes"
        size={styles.image.height * 0.66}
        color={theme.colors.secondary}
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
