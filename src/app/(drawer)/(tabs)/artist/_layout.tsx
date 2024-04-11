import { Stack } from "expo-router";

export default function Posts_layout() {
  return (
    <Stack>
      <Stack.Screen
        name="[artistId]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
