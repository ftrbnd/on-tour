import { Card, useTheme } from "@ui-kitten/components";
import { Skeleton } from "moti/skeleton";
import { View } from "react-native";

interface Props {
  condensed?: boolean;
}

export default function SetlistPreviewSkeleton({ condensed }: Props) {
  const theme = useTheme();

  return (
    <Skeleton.Group show>
      <Card style={{ margin: 4 }}>
        <View style={{ gap: 12 }}>
          {!condensed && (
            <View style={{ gap: 4 }}>
              <Skeleton
                width={120}
                height={24}
                colors={[theme["background-basic-color-2"], theme["background-basic-color-4"]]}
              />
              <Skeleton
                width={192}
                height={20}
                colors={[theme["background-basic-color-2"], theme["background-basic-color-4"]]}
              />
            </View>
          )}

          <Skeleton
            width={100}
            height={16}
            colors={[theme["background-basic-color-2"], theme["background-basic-color-4"]]}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}>
            <Skeleton
              width={132}
              height={12}
              colors={[theme["background-basic-color-2"], theme["background-basic-color-4"]]}
            />
            <Skeleton
              width={96}
              height={12}
              colors={[theme["background-basic-color-2"], theme["background-basic-color-4"]]}
            />
          </View>
        </View>
      </Card>
    </Skeleton.Group>
  );
}
