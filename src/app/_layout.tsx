import * as Sentry from "@sentry/react-native";
import { Layout } from "@ui-kitten/components";
import { isRunningInExpoGo } from "expo";
import { Stack, router, useNavigationContainerRef } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import FocusAwareStatusBar from "../components/ui/FocusAwareStatusBar";
import Providers from "../providers";
import { useAuth } from "../providers/AuthProvider";
import { env } from "../utils/env";

const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

Sentry.init({
  dsn: env.EXPO_PUBLIC_SENTRY_DSN,
  debug: true,
  integrations: [
    new Sentry.ReactNativeTracing({
      routingInstrumentation,
      enableNativeFramesTracking: !isRunningInExpoGo(),
    }),
  ],
});

export default Sentry.wrap(RootLayout);

function RootLayout() {
  const ref = useNavigationContainerRef();

  useEffect(() => {
    if (ref) {
      routingInstrumentation.registerNavigationContainer(ref);
    }
  }, [ref]);

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
      <FocusAwareStatusBar />
      <SafeAreaView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} initialRouteName="(drawer)">
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/sign-in" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaView>
    </Layout>
  );
}
