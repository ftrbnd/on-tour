import { Text } from "@ui-kitten/components";
import { Image } from "expo-image";
import moment from "moment";
import { useState } from "react";
import { View } from "react-native";
import { useMMKVString } from "react-native-mmkv";
import { useToast } from "react-native-toast-notifications";

import UpcomingShowModal from "./UpcomingShowModal";
import useUpcomingShows from "../../hooks/useUpcomingShows";
import { UpcomingShow } from "../../services/upcomingShows";
import SwipeableItem from "../ui/SwipeableItem";

export default function UpcomingShowItem({ show }: { show: UpcomingShow }) {
  const [showImage] = useMMKVString(`upcoming-show-${show.id}-image`);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { deleteShow } = useUpcomingShows();
  const toast = useToast();

  const handleDelete = async () => {
    try {
      await deleteShow(show);
      toast.show("Upcoming show deleted");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <SwipeableItem onEdit={() => setModalVisible(true)} onDelete={handleDelete}>
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

      {modalVisible && (
        <UpcomingShowModal
          visible={modalVisible}
          setVisible={setModalVisible}
          existingShow={show}
        />
      )}
    </>
  );
}
