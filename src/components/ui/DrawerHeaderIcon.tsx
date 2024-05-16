import { DrawerActions } from "@react-navigation/native";
import { Avatar, Icon, useTheme } from "@ui-kitten/components";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";

import { useAuth } from "@/src/providers/AuthProvider";

export default function DrawerHeaderIcon({ iconOnly }: { iconOnly?: boolean }) {
  const navigation = useNavigation();
  const { user } = useAuth();
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
      {user?.avatar && !iconOnly ? (
        <Avatar
          source={{ uri: user.avatar }}
          style={{ height: 36, width: 36 }}
          ImageComponent={Image}
        />
      ) : (
        <Icon
          name="menu-outline"
          style={{ height: 24, width: 24 }}
          fill={theme["color-primary-default"]}
        />
      )}
    </TouchableOpacity>
  );
}
