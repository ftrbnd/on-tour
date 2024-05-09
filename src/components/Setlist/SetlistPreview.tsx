import { Card, Text, useTheme, Icon } from "@ui-kitten/components";
import { useRouter, useSegments } from "expo-router";
import moment from "moment";
import { View } from "react-native";

import { NestedSegment } from "../../utils/segments";
import { Setlist } from "../../utils/setlist-fm-types";

import { UpcomingShow } from "@/src/services/upcomingShows";

interface SetlistProps {
  setlist: Setlist;
  displayArtist?: boolean;
  artistImage?: string;
  isUpcomingShow?: UpcomingShow;
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
      `/${segments[0]}/${segments[1]}/${segments[2]}/${setlist.id}?artistImage=${artistImage}&upcomingShowId=${isUpcomingShow?.id}`,
    );
  };

  return (
    <Card style={{ margin: 4 }} onPress={openSetlistPage}>
      <View style={{ gap: 8 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}>
          <View>
            {displayArtist && <Text category="h5">{setlist.artist.name}</Text>}
            {setlist.tour && (
              <Text category={displayArtist ? "s1" : "h6"}>{setlist.tour.name}</Text>
            )}
          </View>

          {isUpcomingShow && (
            <Icon
              name="star"
              style={{
                alignSelf: "flex-end",
                height: 24,
                width: 24,
              }}
              fill={theme["text-info-color"]}
            />
          )}
        </View>

        <Text category={displayArtist ? "s2" : "s1"}>{setlist.venue.name}</Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}>
          <Text category="c1">{`${setlist.venue.city.name}, ${setlist.venue.city.country.name}`}</Text>
          <Text category="label">
            {moment(setlist.eventDate, "DD-MM-YYYY").format("MMMM Do, YYYY")}
          </Text>
        </View>
      </View>
    </Card>
  );
}
