import { Text } from "@ui-kitten/components";
import { Image } from "expo-image";
import moment from "moment";
import { StyleSheet, View } from "react-native";
import { SheetManager } from "react-native-actions-sheet";
import { useMMKVString } from "react-native-mmkv";

import useUpcomingShows from "../../hooks/useUpcomingShows";
import { UpcomingShow } from "../../services/upcomingShows";
import SwipeableItem from "../ui/SwipeableItem";

export default function UpcomingShowItem({ show }: { show: UpcomingShow }) {
  const [showImage] = useMMKVString(`upcoming-show-${show.id}-image`);

  const { deleteShow } = useUpcomingShows();

  const handleDelete = async () => {
    try {
      await deleteShow(show);
    } catch (e) {
      console.error(e);
    }
  };

  // TODO: add "remove image" option on press and hold
  return (
    <SwipeableItem
      onEdit={async () => await SheetManager.show("upcoming-show-sheet", { payload: show })}
      onDelete={handleDelete}>
      <View style={styles.item}>
        <View style={{ flex: 1 }}>
          <Text category="h6" ellipsizeMode="tail">
            {show.artist} - {show.tour}
          </Text>
          <Text category="s1" ellipsizeMode="tail">
            {show.venue} / {show.city} / {moment(show.date).format("MMMM Do, YYYY")}
          </Text>
        </View>
        {showImage && <Image source={{ uri: showImage }} style={styles.image} />}
      </View>
    </SwipeableItem>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  image: {
    height: 40,
    width: 40,
    borderRadius: 5,
  },
});
