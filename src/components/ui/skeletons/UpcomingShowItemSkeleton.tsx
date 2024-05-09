import { useTheme } from "@ui-kitten/components";
import { Skeleton } from "moti/skeleton";
import { StyleSheet, View } from "react-native";

export default function UpcomingShowItemSkeleton() {
  const theme = useTheme();

  return (
    <Skeleton.Group show>
      <View style={styles.item}>
        <View style={{ flex: 1, gap: 4 }}>
          <Skeleton
            width={125}
            height={24}
            colors={[theme["background-basic-color-2"], theme["background-basic-color-4"]]}
          />
          <Skeleton
            width={300}
            height={20}
            colors={[theme["background-basic-color-2"], theme["background-basic-color-4"]]}
          />
        </View>
        <Skeleton
          height={40}
          width={40}
          colors={[theme["background-basic-color-2"], theme["background-basic-color-4"]]}
        />
      </View>
    </Skeleton.Group>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
