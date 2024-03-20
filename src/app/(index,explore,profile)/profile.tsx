import { randomUUID } from "expo-crypto";
import { Stack } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { View, StyleSheet } from "react-native";
import { useMMKVObject } from "react-native-mmkv";
import { Button, Text, Avatar } from "react-native-paper";

import { useAuth } from "@/src/providers/AuthProvider";
import { Playlist, TrackItem } from "@/src/utils/spotify-types";

const styles = StyleSheet.create({
  container: {
    padding: 8,
    display: "flex",
    alignItems: "center",
  },
  username: {},
});

export default function Profile() {
  const { session, user, signIn, signOut } = useAuth();
  // TODO: figure out how to sync with user's spotify playlists in case they were deleted:
  const [createdPlaylists] = useMMKVObject<Playlist<TrackItem>[]>("created.playlists");

  const openSpotifyPage = async (playlistUrl: string) => {
    try {
      await openBrowserAsync(playlistUrl);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Stack.Screen options={{ headerTitle: user ? user.display_name : "My Library" }} />
      <View style={styles.container}>
        {session ? (
          <Avatar.Image size={120} source={{ uri: user?.images[1].url }} />
        ) : (
          <Avatar.Icon size={120} icon="account" />
        )}
        <Text variant="displayMedium">{user ? user?.display_name : "not signed in"}</Text>
      </View>

      {!session ? (
        <Button onPress={() => signIn()}>Sign in with Spotify</Button>
      ) : (
        <>
          <Button onPress={() => signOut()}>Sign Out</Button>
        </>
      )}

      <Text style={{ fontWeight: "bold" }}>My Setlists</Text>
      {createdPlaylists?.map((playlist) => (
        <Text
          key={`${playlist.id}-${randomUUID()}`}
          onPress={() => openSpotifyPage(playlist.external_urls.spotify)}>
          {playlist.name}
        </Text>
      ))}
    </View>
  );
}
