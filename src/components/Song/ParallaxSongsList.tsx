import { FlashList } from "@shopify/flash-list";
import { Divider, Icon, useTheme } from "@ui-kitten/components";
import { router, useLocalSearchParams } from "expo-router";
import moment from "moment";
import { View } from "react-native";
import { SheetManager } from "react-native-actions-sheet";
import { TouchableOpacity } from "react-native-gesture-handler";
import { withDetailsHeaderFlashList } from "react-native-sticky-parallax-header";

import SongItem from "./SongItem";

import { ArtistIcon, PlaylistIcon } from "@/src/assets/icons";
import useSetlist from "@/src/hooks/useSetlist";
import { Song } from "@/src/utils/setlist-fm-types";

const DetailsHeaderFlashList = withDetailsHeaderFlashList<Song>(FlashList);

export default function ParallaxSongsList({ setlistId }: { setlistId: string }) {
  const setlist = useSetlist(setlistId);
  const theme = useTheme();
  const { artistImage, tour, location, venue, timestamp } = useLocalSearchParams<{
    artistImage?: string;
    tour?: string;
    location?: string;
    venue?: string;
    timestamp?: string;
  }>();

  console.log({ location });

  const image = {
    uri: setlist.spotifyArtist
      ? setlist.spotifyArtist.images[1].url
      : artistImage !== "undefined"
        ? artistImage
        : undefined,
  };

  const cityAndCountry = setlist.data
    ? `${setlist.data.venue.city.name}, ${setlist.data.venue.city.country.name}`
    : location ?? "Unknown location";
  const date = setlist.data
    ? `${moment(setlist.data.eventDate, "DD-MM-YYYY").format("MMMM Do, YYYY")}`
    : timestamp ?? "Unknown date";
  const venueName = setlist.data ? `${setlist.data.venue.name}` : venue ?? "Unknown venue";

  return (
    <DetailsHeaderFlashList
      hasBorderRadius
      leftTopIcon={() => (
        <TouchableOpacity>
          <Icon
            name="chevron-left-outline"
            fill={theme["text-control-color"]}
            style={{ height: 24, width: 24 }}
          />
        </TouchableOpacity>
      )}
      leftTopIconOnPress={router.back}
      rightTopIcon={() => (
        <View style={{ flexDirection: "row", gap: 16 }}>
          <TouchableOpacity
            onPress={async () =>
              await SheetManager.show("info-sheet", {
                payload: {
                  title: "Not the artist you were expecting?",
                  description:
                    "On Tour searches for setlists through setlist.fm, and will match with any artists whose names are similar.",
                },
              })
            }>
            <Icon
              name="question-mark-circle-outline"
              fill={theme["text-control-color"]}
              style={{ height: 24, width: 24 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={setlist.openWebpage}>
            <Icon
              name="external-link-outline"
              fill={theme["text-control-color"]}
              style={{ height: 24, width: 24 }}
            />
          </TouchableOpacity>
        </View>
      )}
      backgroundColor={theme["color-primary-default"]}
      containerStyle={{ backgroundColor: theme["background-basic-color-2"] }}
      title={
        setlist.data?.tour
          ? setlist.data.tour?.name
          : tour !== "undefined"
            ? tour
            : location ?? cityAndCountry
      }
      subtitle={setlist.data?.artist.name ?? "Artist"}
      image={image.uri ? image : ArtistIcon}
      tag={setlist.data?.tour ? `${cityAndCountry}\n${venueName}` : `${date}\n${venueName}`}
      contentIcon={PlaylistIcon}
      contentIconNumber={setlist.songs.length}
      estimatedItemSize={150}
      contentContainerStyle={{ padding: 8 }}
      data={setlist.songs}
      renderItem={({ item, index }) => (
        <SongItem
          item={item}
          loading={setlist.spotifyTracksLoading}
          image={setlist.spotifyTracks
            ?.map((track) => (track ? track.album.images[0] : null))
            .at(index)}
          link={setlist.spotifyTracks
            .map((track) => (track ? track.external_urls.spotify : null))
            .at(index)}
        />
      )}
      ItemSeparatorComponent={() => <Divider />}
    />
  );
}
