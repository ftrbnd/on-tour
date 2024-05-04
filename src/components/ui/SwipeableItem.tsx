import { Text } from "@ui-kitten/components";
import { ReactNode } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { RectButton, Swipeable, TouchableOpacity } from "react-native-gesture-handler";

function renderRightAction(
  text: string,
  color: string,
  x: number,
  progress: Animated.AnimatedInterpolation<string | number>,
  onPress: () => void,
) {
  const trans = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [x, 0],
  });

  return (
    <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
      <RectButton style={[styles.rightAction, { backgroundColor: color }]} onPress={onPress}>
        <Text style={styles.actionText}>{text}</Text>
      </RectButton>
    </Animated.View>
  );
}

export default function SwipeableItem({
  children,
  onEdit,
  onDelete,
}: {
  children: ReactNode;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Swipeable
      renderRightActions={(progress) => (
        <View style={{ width: 192, flexDirection: "row" }}>
          {renderRightAction("Edit", "lightgray", 192, progress, onEdit)}
          {renderRightAction("Delete", "red", 128, progress, onDelete)}
        </View>
      )}
      friction={2}
      leftThreshold={30}
      rightThreshold={40}
      overshootRight={false}>
      <TouchableOpacity onPress={onEdit}>{children}</TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  rightAction: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  actionText: {
    color: "white",
    fontSize: 16,
    backgroundColor: "transparent",
    padding: 10,
  },
});
