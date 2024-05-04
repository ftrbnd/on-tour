import { Button, Icon, Text, useTheme } from "@ui-kitten/components";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

import LoadingIndicator from "@/src/components/ui/LoadingIndicator";
import { useAuth } from "@/src/providers/AuthProvider";

export default function Login() {
  const { isLoading, session, signIn, refreshSession } = useAuth();
  const theme = useTheme();
  const { status }: { status: string } = useLocalSearchParams();

  useEffect(() => {
    if (status === "401") refreshSession();
  }, [status]);

  if (session) return <Redirect href="/home" />;

  return (
    <LinearGradient
      colors={[theme["color-primary-200"], theme["color-primary-300"]]}
      style={styles.container}>
      <View style={{ gap: 8, justifyContent: "center", alignItems: "center" }}>
        <Text category="h1" style={{ color: theme["text-basic-color"] }}>
          On Tour
        </Text>
        <Text category="h6" style={{ color: theme["text-basic-color"] }}>
          Create playlists from your favorite shows
        </Text>
      </View>
      <Button
        disabled={isLoading}
        accessoryLeft={isLoading ? <LoadingIndicator /> : <Icon name="log-in-outline" />}
        onPress={signIn}>
        {isLoading ? "Authenticating..." : "Sign in with Spotify"}
      </Button>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 32,
    justifyContent: "center",
    alignItems: "center",
  },
});
