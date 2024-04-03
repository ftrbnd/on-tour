import moment from "moment";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { useMMKVString } from "react-native-mmkv";
import { List } from "react-native-paper";

import SwipeableItem from "./SwipeableItem";
import UpcomingShowModal from "./UpcomingShowModal";
import useUpcomingShows from "../hooks/useUpcomingShows";
import { UpcomingShow } from "../services/upcomingShows";

const styles = StyleSheet.create({
  listItem: {
    padding: 8,
  },
});

export default function UpcomingShowItem({ show }: { show: UpcomingShow }) {
  const [showImage] = useMMKVString(`upcoming-show-${show.id}-image`);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { deleteShow } = useUpcomingShows();

  return (
    <>
      <SwipeableItem onEdit={() => setModalVisible(true)} onDelete={() => deleteShow(show)}>
        <List.Item
          title={`${show.artist} - ${show.tour}`}
          description={`${show.venue} / ${show.city} / ${moment(show.date, "YYYY-MM-DD-MM").format("MMMM Do, YYYY")}`}
          titleEllipsizeMode="tail"
          left={() => <List.Icon icon={{ uri: showImage }} />}
          style={styles.listItem}
        />
      </SwipeableItem>

      {modalVisible && (
        <UpcomingShowModal visible={modalVisible} setVisible={setModalVisible} editingShow={show} />
      )}
    </>
  );
}
