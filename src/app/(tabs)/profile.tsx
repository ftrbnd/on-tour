import { useQuery } from "@tanstack/react-query";
import { View, Text } from "react-native";
import { Button, Avatar, HelperText } from "react-native-paper";

import { useAuth } from "@/src/providers/AuthProvider";
import { getTopArtists } from "@/src/services/spotify";

export default function Profile() {
  const { session, signIn, signOut } = useAuth();

  const { data, refetch, error } = useQuery({
    queryKey: ["top-artists"],
    queryFn: () => getTopArtists(session?.accessToken),
    enabled: session?.accessToken != null,
  });

  return (
    <View>
      <Text>{session ? session.user?.display_name : "not signed in"}</Text>
      {!session ? (
        <Button onPress={() => signIn()}>Sign in with Spotify</Button>
      ) : (
        <>
          {session.user?.images[0] ? (
            <Avatar.Image size={48} source={{ uri: session.user?.images[0].url }} />
          ) : (
            <Avatar.Icon size={48} icon="account" />
          )}
          <Button onPress={() => signOut()}>Sign Out</Button>
          <Button onPress={() => refetch()}>Refetch</Button>
          <HelperText type="error" visible={error != null}>
            {error?.message}
          </HelperText>
          <Text>{data ? "data found" : "data not found"}</Text>
        </>
      )}
    </View>
  );
}
