import { useRouter, useSegments } from "expo-router";
import moment from "moment";
import { Card, Text } from "react-native-paper";

import { NestedSegment } from "../../utils/segments";
import { Setlist } from "../../utils/setlist-fm-types";

interface SetlistProps {
  setlist: Setlist;
  displayArtist?: boolean;
  artistImage?: string;
}

export default function SetlistPreview({ setlist, displayArtist, artistImage }: SetlistProps) {
  const router = useRouter();
  const segments = useSegments<NestedSegment>();

  const openSetlistPage = () => {
    router.push(
      !displayArtist
        ? `/${segments[0]}/${segments[1]}/${segments[2]}/${setlist.id}?artistImage=${artistImage}`
        : `/${segments[0]}/${segments[1]}/${segments[2]}/${setlist.id}`,
    );
  };

  return (
    <Card style={{ margin: 4 }} onPress={openSetlistPage}>
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
