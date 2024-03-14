import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Button, Text, Avatar } from "react-native-paper";

import { useAuth } from "@/src/providers/AuthProvider";

const styles = StyleSheet.create({
  container: {
    padding: 8,
    display: "flex",
    alignItems: "center",
  },
  username: {},
});

export default function Profile() {
  const { session, signIn, signOut } = useAuth();

  return (
    <View>
      <Stack.Screen options={{ headerTitle: session?.user ? session?.user.display_name : "You" }} />
      <View style={styles.container}>
        {session ? (
          <Avatar.Image size={120} source={{ uri: session.user?.images[1].url }} />
        ) : (
          <Avatar.Icon size={120} icon="account" />
        )}
        <Text variant="displayMedium">
          {session ? session.user?.display_name : "not signed in"}
        </Text>
      </View>

      {!session ? (
        <Button onPress={() => signIn()}>Sign in with Spotify</Button>
      ) : (
        <>
          <Button onPress={() => signOut()}>Sign Out</Button>
        </>
      )}
    </View>
  );
}
