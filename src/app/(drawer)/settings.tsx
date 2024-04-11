import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";
import { Avatar, Button } from "react-native-paper";

import { useAuth } from "@/src/providers/AuthProvider";

export default function Settings() {
  const { session, user, signIn, signOut } = useAuth();

  return (
    <View style={styles.container}>
      {user?.avatar ? (
        <Avatar.Image source={{ uri: user.avatar, width: 24, height: 24 }} />
      ) : (
        <Avatar.Icon icon={() => <Ionicons name="person" size={24} />} />
      )}
      <Button onPress={session ? signOut : signIn}>
        {session ? `${user?.displayName ?? user?.providerId} - Sign Out` : "Sign in with Spotify"}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
