import { Card, useTheme } from "@ui-kitten/components";
import { Skeleton } from "moti/skeleton";
import { View } from "react-native";

const randomWidths = [80, 90, 100, 110, 120, 130, 140, 150];

export default function ArtistPreviewSkeleton() {
  const theme = useTheme();

  return (
    <Skeleton.Group show>
      <Card style={{ margin: 8 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Skeleton
              radius="round"
              colors={[theme["background-basic-color-2"], theme["background-basic-color-4"]]}
            />

            <Skeleton
              width={randomWidths[Math.floor(Math.random() * randomWidths.length)]}
              height={24}
              colors={[theme["background-basic-color-2"], theme["background-basic-color-4"]]}
            />
          </View>
        </View>
      </Card>
    </Skeleton.Group>
  );
}
