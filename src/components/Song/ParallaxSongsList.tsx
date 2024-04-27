import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { router, useLocalSearchParams } from "expo-router";
import moment from "moment";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Divider, useTheme } from "react-native-paper";
import { withDetailsHeaderFlashList } from "react-native-sticky-parallax-header";

import SongItem from "./SongItem";

import { ArtistIcon, PlaylistIcon } from "@/src/assets/icons";
import useSetlist from "@/src/hooks/useSetlist";
import { Song } from "@/src/utils/setlist-fm-types";

const DetailsHeaderFlashList = withDetailsHeaderFlashList<Song>(FlashList);

export default function ParallaxSongsList({
  setlistId,
  setDialogVisible,
}: {
  setlistId: string;
  setDialogVisible: (vis: boolean) => void;
}) {
  const setlist = useSetlist(setlistId);
  const theme = useTheme();
  const { artistImage } = useLocalSearchParams<{ artistImage?: string }>();

  const image = { uri: setlist.spotifyArtist ? setlist.spotifyArtist.images[1].url : artistImage };

  const cityAndCountry = setlist.data
    ? `${setlist.data.venue.city.name}, ${setlist.data.venue.city.country.name}`
    : "Unknown location";
  const date = setlist.data
    ? `${moment(setlist.data.eventDate, "DD-MM-YYYY").format("MMMM Do, YYYY")}`
    : "Unknown date";
  const venue = setlist.data ? `${setlist.data.venue.name}` : "Unknown venue";

  return (
    <DetailsHeaderFlashList
      hasBorderRadius
      leftTopIcon={() => (
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color={theme.colors.onSecondaryContainer} />
        </TouchableOpacity>
      )}
      leftTopIconOnPress={router.back}
      rightTopIcon={() => (
        <View style={{ flexDirection: "row", gap: 16 }}>
          <TouchableOpacity onPress={() => setDialogVisible(true)}>
            <SimpleLineIcons name="question" size={24} color={theme.colors.onPrimaryContainer} />
          </TouchableOpacity>
          <TouchableOpacity onPress={setlist.openWebpage}>
            <Ionicons name="open-outline" size={24} color={theme.colors.onPrimaryContainer} />
          </TouchableOpacity>
        </View>
      )}
      backgroundColor={theme.colors.secondaryContainer}
      containerStyle={{ backgroundColor: theme.colors.surface }}
      title={setlist.data?.tour?.name ?? cityAndCountry}
      titleStyle={{ color: theme.colors.onSecondaryContainer }}
      subtitle={setlist.data?.artist.name ?? "Artist"}
      image={image.uri ? image : ArtistIcon}
      tag={setlist.data?.tour ? `${cityAndCountry}\n${venue}` : `${date}\n${venue}`}
      tagStyle={{
        backgroundColor: theme.colors.surface,
        color: theme.colors.onSurface,
        borderRadius: 25,
      }}
      contentIcon={PlaylistIcon}
      contentIconNumber={setlist.songs.length}
      contentIconNumberStyle={{
        color: "#000",
      }}
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
