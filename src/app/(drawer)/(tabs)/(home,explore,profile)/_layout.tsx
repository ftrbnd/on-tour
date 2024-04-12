import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { Stack, useNavigation } from "expo-router";

import { Group, Segment } from "@/src/utils/segments";

export default function Layout({ segment }: { segment: Group<Segment> }) {
  const navigation = useNavigation();

  const headerTitle =
    segment === "(home)"
      ? "On Tour"
      : segment.replaceAll(/\(|\)/g, "").replace(/^\w/, (c) => c.toUpperCase());

  return (
    <Stack
      screenOptions={{
        headerTitle,
        headerTitleAlign: "center",
        headerLeft: () => (
          <Ionicons
            name="menu"
            size={24}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          />
        ),
      }}
    />
  );
}
