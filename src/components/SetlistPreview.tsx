import { useRouter, useSegments } from "expo-router";
import moment from "moment";
import { StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";

import { SharedSegment } from "../utils/segments";
import { Setlist } from "../utils/setlist-fm-types";

const styles = StyleSheet.create({
  card: {
    margin: 4,
  },
});

export default function SetlistPreview({
  setlist,
  displayArtist,
}: {
  setlist: Setlist;
  displayArtist?: boolean;
}) {
  const router = useRouter();
  const [segment] = useSegments() as [SharedSegment];

  const openSetlistPage = () => {
    router.push(`/${segment}/${setlist.id}`);
  };

  return (
    <Card style={styles.card} onPress={openSetlistPage}>
      <Card.Content>
        {displayArtist && <Text variant="titleLarge">{setlist.artist.name}</Text>}
        <Text variant="titleMedium">{`${setlist.venue.city.name}, ${setlist.venue.city.country.name}`}</Text>
        {setlist.tour && <Text>{setlist.tour?.name}</Text>}
      </Card.Content>
      <Card.Title
        title={`${setlist.venue.name}`}
        titleVariant="bodyMedium"
        subtitle={moment(setlist.eventDate, "DD-MM-YYYY").format("MMMM Do, YYYY")}
        subtitleVariant="bodySmall"
      />
    </Card>
  );
}
