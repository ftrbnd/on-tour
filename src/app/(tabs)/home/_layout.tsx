import { Stack } from "expo-router";

const HomeLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerTitle: "On Tour" }} />
      <Stack.Screen name="[artistId]" />
    </Stack>
  );
};

export default HomeLayout;
