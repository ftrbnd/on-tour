import { useQuery } from "@tanstack/react-query";
import { Layout, Text } from "@ui-kitten/components";

import ArtistList from "@/src/components/Artist/ArtistList";
import { getTokenFromServer } from "@/src/services/auth";
import { getSampleArtists } from "@/src/services/spotify";

export default function Popular() {
  const { data: accessToken } = useQuery({
    queryKey: ["anon-session"],
    queryFn: getTokenFromServer,
  });

  const { data: artists, isPending } = useQuery({
    queryKey: ["sample-artists"],
    queryFn: () => getSampleArtists(accessToken),
    enabled: accessToken !== undefined,
  });

  return (
    <Layout level="2" style={{ flex: 1 }}>
      <Text category="h4" style={{ marginHorizontal: 16, marginTop: 8 }}>
        Artists
      </Text>
      <ArtistList
        artists={artists ?? []}
        isPending={isPending}
        showsVerticalScrollIndicator={false}
        tapDisabled
      />
    </Layout>
  );
}
