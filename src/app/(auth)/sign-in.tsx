import { Entypo } from "@expo/vector-icons";
import { Redirect } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

import { useAuth } from "@/src/providers/AuthProvider";

export default function Login() {
  const { isLoading, session, signIn, refreshSession } = useAuth();

  if (session) {
    refreshSession();
    console.log("refreshed session");
    return <Redirect href="/home" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.display}>On Tour</Text>
      <Text style={styles.paragraph}>Create playlists from your favorite shows</Text>
      <Button
        loading={isLoading}
        disabled={isLoading}
        icon={({ color }) => <Entypo name="spotify" size={24} color={color} />}
        onPress={signIn}>
        {isLoading ? "Authenticating..." : "Sign in with Spotify"}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  display: {
    fontWeight: "bold",
    fontSize: 48,
  },
  paragraph: {
    fontSize: 14,
  },
});
