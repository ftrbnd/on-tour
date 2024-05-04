import { Icon, useTheme } from "@ui-kitten/components";
import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface Props {
  uri?: string;
  onPress?: () => void;
}

export default function PlaylistImage({ uri, onPress }: Props) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      containerStyle={{
        borderRadius: 10,
        borderWidth: 1,
        borderColor: theme["border-basic-color-5"],
      }}>
      {uri ? (
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
