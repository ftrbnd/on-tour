import { DrawerActions } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { Layout, Radio, RadioGroup, Text, ViewPager, useTheme } from "@ui-kitten/components";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import ArtistList from "@/src/components/Artist/ArtistList";
import SetlistList from "@/src/components/Setlist/SetlistList";
import { getTokenFromServer } from "@/src/services/auth";
import { getRecentShows } from "@/src/services/setlist-fm";
import { getSampleArtists } from "@/src/services/spotify";

export default function Popular() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const theme = useTheme();
  const navigation = useNavigation();

  const { data: accessToken } = useQuery({
    queryKey: ["anon-session"],
    queryFn: getTokenFromServer,
  });

  const { data: artists, isPending: artistsPending } = useQuery({
    queryKey: ["sample-artists"],
    queryFn: () => getSampleArtists(accessToken),
    enabled: accessToken !== undefined,
  });

  const { data: setlists, isPending: setlistsPending } = useQuery({
    queryKey: ["sample-setlists"],
    queryFn: () => getRecentShows(artists),
    enabled: artists !== undefined && artists.length > 0,
  });

  return (
    <Layout level="2" style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: theme["color-warning-default"],
          width: "100%",
        }}>
        <TouchableOpacity>
          <Text
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            category="label"
            style={{
              alignSelf: "center",
              padding: 16,
              textAlign: "center",
              color: theme["color-basic-1000"],
            }}>
            You are currently accessing On Tour in view-only mode! Sign in with Spotify to get
            started.
          </Text>
        </TouchableOpacity>
      </View>

      <RadioGroup
        selectedIndex={selectedIndex}
        onChange={(index) => setSelectedIndex(index)}
        style={{ flexDirection: "row", justifyContent: "center", gap: 16, marginTop: 8 }}>
        <Radio />
        <Radio />
      </RadioGroup>

      <ViewPager
        selectedIndex={selectedIndex}
        onSelect={(index) => setSelectedIndex(index)}
        style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Text category="h4" style={{ marginHorizontal: 16 }}>
            Artists
          </Text>
          <ArtistList
            artists={artists ?? []}
            isPending={artistsPending}
            showsVerticalScrollIndicator={false}
            tapDisabled
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text category="h4" style={{ marginHorizontal: 16 }}>
            Setlists
          </Text>
          <SetlistList setlists={setlists ?? []} isPending={setlistsPending} tapDisabled />
        </View>
      </ViewPager>
    </Layout>
  );
}
