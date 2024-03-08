import { useRouter } from "expo-router";
import moment from "moment";
import { StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";

import { Setlist } from "../utils/setlist-fm-types";

const styles = StyleSheet.create({
  card: {
    margin: 4,
  },
});

export default function SetlistPreview({ setlist }: { setlist: Setlist }) {
  const router = useRouter();

  const openSetlistPage = () => {
    router.push(`/(tabs)/setlist/${setlist.id}`);
  };

  return (
    <Card style={styles.card} onPress={openSetlistPage}>
      <Card.Content>
        <Text variant="titleLarge">{`${setlist.venue.city.name}, ${setlist.venue.city.country.name}`}</Text>
        {setlist.tour && <Text>{setlist.tour?.name}</Text>}
      </Card.Content>
      <Card.Title
        title={`${setlist.venue.name}`}
        subtitle={moment(setlist.eventDate, "DD-MM-YYYY").format("MMMM Do, YYYY")}
      />
    </Card>
  );
}
