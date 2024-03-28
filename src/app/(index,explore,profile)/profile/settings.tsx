import { View } from "react-native";
import { Button } from "react-native-paper";

import { useAuth } from "@/src/providers/AuthProvider";

export default function Settings() {
  const { user, signIn, signOut } = useAuth();

  return (
    <View>
      {user ? (
        <Button onPress={() => signOut()}>Sign Out</Button>
      ) : (
        <Button onPress={() => signIn()}>Sign in with Spotify</Button>
      )}
    </View>
  );
}
