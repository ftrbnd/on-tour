import { View, Text } from "react-native";
import { Button, Avatar } from "react-native-paper";

import { useAuth } from "@/src/providers/AuthProvider";

export default function Profile() {
  const auth = useAuth();

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
        </>
      )}
    </View>
  );
}
