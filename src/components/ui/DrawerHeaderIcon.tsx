import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useTheme } from "@ui-kitten/components";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { useAuth } from "@/src/providers/AuthProvider";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function DrawerHeaderIcon({ marginLeft }: { marginLeft?: number }) {
  const navigation = useNavigation();
  const { user } = useAuth();
  const theme = useTheme();

  return (
    <TouchableOpacity>
      {user?.avatar && !marginLeft ? (
        <Image
          source={{
            uri: user.avatar,
            cacheKey: "on-tour-user-avatar",
            blurhash,
            width: 36,
            height: 36,
          }}
          style={styles.image}
          contentFit="cover"
          placeholder={blurhash}
          transition={500}
          onTouchStart={() => navigation.dispatch(DrawerActions.openDrawer())}
        />
      ) : (
        <Ionicons
          name="menu"
          size={24}
          style={{ marginLeft }}
          color={theme["color-primary-default"]}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 36,
    width: 36,
    borderRadius: 25,
  },
});
