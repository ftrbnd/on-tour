import { Layout, useTheme } from "@ui-kitten/components";
import { Skeleton } from "moti/skeleton";
import { View } from "react-native";

const BORDER_RADIUS = 10;

export default function VerticalPlaylistItemSkeleton() {
  const theme = useTheme();

  return (
    <Skeleton.Group show>
      <Layout
        style={{
          height: 250,
          width: 200,
          margin: 8,
          borderRadius: BORDER_RADIUS,
          borderWidth: 1,
          borderColor: theme["border-basic-color-4"],
        }}>
        <Skeleton
          width={200}
          height={200}
          colors={[theme["background-basic-color-2"], theme["background-basic-color-4"]]}
        />

        <View style={{ padding: 4 }}>
          <Skeleton
            height={24}
            width={144}
            colors={[theme["background-basic-color-2"], theme["background-basic-color-4"]]}
          />
        </View>
      </Layout>
    </Skeleton.Group>
  );
}
