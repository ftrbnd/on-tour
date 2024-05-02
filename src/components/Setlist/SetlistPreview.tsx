import { Card, Layout, Text, useTheme, Icon } from "@ui-kitten/components";
import { useRouter, useSegments } from "expo-router";
import moment from "moment";

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
      {displayArtist && <Text category="h5">{setlist.artist.name}</Text>}
      {setlist.tour && <Text category="h6">{setlist.tour.name}</Text>}

      <Layout
        style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
        <Layout style={{ gap: 4 }}>
          <Text
            category={
              displayArtist ? "s2" : "h6"
            }>{`${setlist.venue.city.name}, ${setlist.venue.city.country.name}`}</Text>
          <Text category={displayArtist ? "s2" : "s1"}>{setlist.venue.name}</Text>
          <Text category="label">
            {moment(setlist.eventDate, "DD-MM-YYYY").format("MMMM Do, YYYY")}
          </Text>
        </Layout>

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
      </Layout>
    </Card>
  );
}
