import { Ionicons } from "@expo/vector-icons";
import { useRouter, useSegments } from "expo-router";
import moment from "moment";
import { View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";

import { NestedSegment } from "../../utils/segments";
import { Setlist } from "../../utils/setlist-fm-types";

interface SetlistProps {
  setlist: Setlist;
  displayArtist?: boolean;
  artistImage?: string;
  isUpcomingShow?: boolean;
}

export default function SetlistPreview({
  setlist,
  displayArtist,
  artistImage,
  isUpcomingShow,
}: SetlistProps) {
  const router = useRouter();
  const segments = useSegments<NestedSegment>();
  const theme = useTheme();

  const openSetlistPage = () => {
    router.push(
      !displayArtist
        ? `/${segments[0]}/${segments[1]}/${segments[2]}/${setlist.id}?artistImage=${artistImage}&isUpcomingShow=${isUpcomingShow}`
        : `/${segments[0]}/${segments[1]}/${segments[2]}/${setlist.id}?isUpcomingShow=${isUpcomingShow}`,
    );
  };

  return (
    <Card style={{ margin: 4 }} onPress={openSetlistPage}>
      <Card.Title
        title={setlist.artist.name}
        titleVariant="titleLarge"
        subtitle={setlist.tour?.name}
        subtitleVariant="titleMedium"
      />
      <Card.Content style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          <Text variant="titleSmall">{`${setlist.venue.city.name}, ${setlist.venue.city.country.name}`}</Text>
          <Text variant="titleSmall">{setlist.venue.name}</Text>
          <Text variant="titleSmall">
            {moment(setlist.eventDate, "DD-MM-YYYY").format("MMMM Do, YYYY")}
          </Text>
        </View>
        {isUpcomingShow && (
          <Ionicons
            name="star"
            size={24}
            color={theme.colors.tertiary}
            style={{ alignSelf: "flex-end" }}
          />
        )}
      </Card.Content>
    </Card>
  );
}
