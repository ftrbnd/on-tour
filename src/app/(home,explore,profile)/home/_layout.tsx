import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { Stack, withLayoutContext } from "expo-router";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function TopTabsLayout() {
  return (
    <>
      <Stack.Screen options={{ headerTitle: "On Tour", headerTitleAlign: "center" }} />
      <MaterialTopTabs
        initialRouteName="index"
        screenOptions={{ tabBarLabelStyle: { textTransform: "capitalize", fontWeight: "bold" } }}>
        <MaterialTopTabs.Screen name="following" />
        <MaterialTopTabs.Screen name="index" options={{ tabBarLabel: "Recent" }} />
      </MaterialTopTabs>
    </>
  );
}
