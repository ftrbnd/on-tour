import { useQuery } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Button, Text, Avatar } from "react-native-paper";

import { useAuth } from "@/src/providers/AuthProvider";
import { getPlaylists } from "@/src/services/db";

const styles = StyleSheet.create({
  container: {
    padding: 8,
    display: "flex",
    alignItems: "center",
  },
  username: {},
});

export default function Profile() {
  const { user, session, signIn, signOut } = useAuth();

  const { data: playlists } = useQuery({
    queryKey: ["created-playlists"],
    queryFn: () => getPlaylists(session?.token, user?.id),
    enabled: user !== null,
  });

  return (
    <>
      <Stack.Screen
        options={{ headerTitle: user ? user.displayName ?? user.providerId : "My Library" }}
      />
      <View>
        <View style={styles.container}>
          {user ? (
            <Avatar.Image size={120} source={{ uri: user?.avatar ?? "" }} />
          ) : (
            <Avatar.Icon size={120} icon="account" />
          )}
          <Text variant="displayMedium">
            {user ? user.displayName ?? user.providerId : "not signed in"}
          </Text>
        </View>

        {user ? (
          <Button onPress={() => signOut()}>Sign Out</Button>
        ) : (
          <Button onPress={() => signIn()}>Sign in with Spotify</Button>
        )}
      </View>

      <View>
        <Text>My Playlists</Text>
        {playlists?.map((p) => <Text key={p.id}>{p.id}</Text>)}
      </View>
    </>
  );
}
