import { Button, Icon, Text, useTheme } from "@ui-kitten/components";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View, useColorScheme } from "react-native";
import { useToast } from "react-native-toast-notifications";

import FocusAwareStatusBar from "@/src/components/ui/FocusAwareStatusBar";
import LoadingIndicator from "@/src/components/ui/LoadingIndicator";
import { useAuth } from "@/src/providers/AuthProvider";

export default function Login() {
  const { isLoading, session, signIn, signOut } = useAuth();
  const theme = useTheme();
  const { status }: { status: string } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const toast = useToast();

  useEffect(() => {
    if (status === "401") {
      signOut();
      toast.show("Spotify session expired");
    }
  }, [status]);

  if (session) return <Redirect href="/home" />;

  return (
    <LinearGradient
      colors={[
        theme["background-basic-color-1"],
        colorScheme === "dark" ? theme["color-primary-900"] : theme["color-primary-500"],
      ]}
      style={styles.container}>
      <FocusAwareStatusBar backgroundColor={theme["background-basic-color-1"]} />

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
