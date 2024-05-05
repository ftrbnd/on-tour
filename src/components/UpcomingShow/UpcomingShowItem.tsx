import { Text } from "@ui-kitten/components";
import { Image } from "expo-image";
import moment from "moment";
import { View } from "react-native";
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

  return (
    <SwipeableItem
      onEdit={async () => await SheetManager.show("upcoming-show-sheet", { payload: show })}
      onDelete={handleDelete}>
      <View style={{ paddingVertical: 8, paddingHorizontal: 16 }}>
        {showImage && <Image source={{ uri: showImage }} />}
        <Text category="h6" ellipsizeMode="tail">
          {show.artist} - {show.tour}
        </Text>
        <Text category="s1" ellipsizeMode="tail">
          {show.venue} / {show.city} / {moment(show.date).format("MMMM Do, YYYY")}
        </Text>
      </View>
    </SwipeableItem>
  );
}
