import { Stack } from "expo-router";

export default function ExploreLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerTitle: "Explore" }} />
      <Stack.Screen name="[artistId]" />
    </Stack>
  );
}
