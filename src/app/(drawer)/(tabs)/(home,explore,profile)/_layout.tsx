import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetView, TouchableOpacity } from "@gorhom/bottom-sheet";
import { DrawerActions } from "@react-navigation/native";
import { Image } from "expo-image";
import { Stack, useNavigation } from "expo-router";
import { useRef } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { Text } from "react-native-paper";

import { useAuth } from "@/src/providers/AuthProvider";
import { Group, Segment } from "@/src/utils/segments";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function Layout({ segment }: { segment: Group<Segment> }) {
  const navigation = useNavigation();
  const { user } = useAuth();

  const colorScheme = useColorScheme();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const headerTitle =
    segment === "(home)"
      ? "On Tour"
      : segment.replaceAll(/\(|\)/g, "").replace(/^\w/, (c) => c.toUpperCase());

  return (
    <>
      <Stack
        screenOptions={{
          headerTitle,
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity>
              {user?.avatar ? (
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
                  onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                />
              )}
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity>
              <Ionicons
                name={colorScheme === "dark" ? "sunny-outline" : "moon-outline"}
                size={24}
                onPress={() => bottomSheetModalRef.current?.present()}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={[200, 400]}
        enableDismissOnClose
        containerStyle={styles.container}
        onDismiss={() => bottomSheetModalRef.current?.close()}>
        <BottomSheetView style={styles.contentContainer}>
          <Text>Awesome 🎉</Text>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 36,
    width: 36,
    borderRadius: 25,
  },
  container: {
    backgroundColor: "rgba(30,30,30,.6)",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});
