import { useQuery } from "@tanstack/react-query";
import { View, Text } from "react-native";
import { Button, Avatar, HelperText } from "react-native-paper";

import { useAuth } from "@/src/providers/AuthProvider";
import { getTopArtists } from "@/src/services/spotify";

export default function Profile() {
  const auth = useAuth();

  const { data, refetch, error } = useQuery({
    queryKey: ["artists"],
    queryFn: () => getTopArtists(auth.providerToken),
    enabled: auth.providerToken != null,
  });

  return (
    <View>
      <Text>{auth.session ? auth.user?.username : "not signed in"}</Text>
      {!auth.session ? (
        <Button onPress={() => auth.signIn()}>Sign in with Spotify</Button>
      ) : (
        <>
          {auth.user?.avatar_url ? (
            <Avatar.Image size={48} source={{ uri: auth.user?.avatar_url }} />
          ) : (
            <Avatar.Icon size={48} icon="account" />
          )}
          <Button onPress={() => auth.signOut()}>Sign Out</Button>
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
