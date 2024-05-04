import { Text, TopNavigation } from "@ui-kitten/components";
import { Stack } from "expo-router";

import DrawerHeaderIcon from "@/src/components/ui/DrawerHeaderIcon";
import { Group, Segment } from "@/src/utils/segments";

export default function Layout({ segment }: { segment: Group<Segment> }) {
  const headerTitle =
    segment === "(home)"
      ? "On Tour"
      : segment.replaceAll(/\(|\)/g, "").replace(/^\w/, (c) => c.toUpperCase());

  return (
    <Stack
      screenOptions={{
        header: () => (
          <TopNavigation
            title={() => <Text category="h6">{headerTitle}</Text>}
            accessoryLeft={() => <DrawerHeaderIcon />}
            alignment="center"
          />
        ),
      }}
    />
  );
}
