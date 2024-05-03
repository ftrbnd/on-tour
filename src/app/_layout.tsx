import { Layout } from "@ui-kitten/components";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import Providers from "../providers";
import { useAuth } from "../providers/AuthProvider";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    InterVariable: require("../assets/fonts/InterVariable.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <Providers>
      <RoutingSetup />
    </Providers>
  );
}

function RoutingSetup() {
  const { session, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded && !session) {
      router.replace("/(auth)/sign-in");
    } else {
      router.replace("/(drawer)/(tabs)/home");
    }
  }, [session, isLoaded]);

  return <StackLayout />;
}

function StackLayout() {
  return (
    <Layout style={{ flex: 1 }}>
      <StatusBar />
      <SafeAreaView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} initialRouteName="(drawer)">
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/sign-in" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaView>
    </Layout>
  );
}
