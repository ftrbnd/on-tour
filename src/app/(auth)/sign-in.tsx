import { Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

import { useAuth } from "@/src/providers/AuthProvider";

export default function Login() {
  const { isLoading, session, signIn, refreshSession } = useAuth();
  const theme = useTheme();
  const { status }: { status: string } = useLocalSearchParams();

  if (status === "401") refreshSession();

  if (session) return <Redirect href="/home" />;

  return (
    <LinearGradient
      colors={[theme.colors.secondary, theme.colors.secondaryContainer]}
      style={styles.container}>
      <Text style={[styles.display, { color: theme.colors.onSecondary }]}>On Tour</Text>
      <Text style={[styles.paragraph, { color: theme.colors.onSecondaryContainer }]}>
        Create playlists from your favorite shows
      </Text>
      <Button
        loading={isLoading}
        disabled={isLoading}
        icon={() => <Entypo name="spotify" size={24} color={theme.colors.onSecondaryContainer} />}
        labelStyle={{ color: theme.colors.onSecondaryContainer }}
        onPress={signIn}>
        {isLoading ? "Authenticating..." : "Sign in with Spotify"}
      </Button>
    </LinearGradient>
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
