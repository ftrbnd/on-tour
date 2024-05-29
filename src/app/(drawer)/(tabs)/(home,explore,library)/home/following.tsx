import { Layout } from "@ui-kitten/components";

import ArtistList from "@/src/components/Artist/ArtistList";
import useFollowingArtists from "@/src/hooks/useFollowingArtists";
import useTopArtists from "@/src/hooks/useTopArtists";

export default function Following() {
  const top = useTopArtists();
  const following = useFollowingArtists();

  // prioritize showing Top Artists on this page
  const dataToUse = top.topArtists.length > 0 ? top : following;

  return (
    <Layout level="2" style={{ flex: 1 }}>
      <ArtistList
        artists={dataToUse.type === "top" ? top.topArtists : following.followingArtists}
        isPending={dataToUse.isPending}
        isPlaceholderData={dataToUse.isPlaceholderData}
        showsVerticalScrollIndicator={false}
        next={dataToUse.next}
        setNext={dataToUse.setNext}
        onRefresh={dataToUse.refetch}
        refreshing={dataToUse.isRefetching}
      />
    </Layout>
  );
}
