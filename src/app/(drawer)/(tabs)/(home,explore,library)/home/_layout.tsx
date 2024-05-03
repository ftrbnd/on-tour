import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
  MaterialTopTabBarProps,
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { Tab, TabBar } from "@ui-kitten/components";
import { withLayoutContext } from "expo-router";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

const TopTabBar = ({ navigation, state }: MaterialTopTabBarProps) => (
  <TabBar
    selectedIndex={state.index}
    onSelect={(index) => navigation.navigate(state.routeNames[index])}
    style={{ paddingVertical: 12 }}
    indicatorStyle={{ marginVertical: -1 }}>
    <Tab title="Following" />
    <Tab title="Recent" />
  </TabBar>
);

export default function TopTabsLayout() {
  return (
    <MaterialTopTabs
      tabBar={(props) => <TopTabBar {...props} />}
      initialRouteName="index"
      screenOptions={{ tabBarLabelStyle: { textTransform: "capitalize", fontWeight: "bold" } }}>
      <MaterialTopTabs.Screen name="following" />
      <MaterialTopTabs.Screen name="index" options={{ tabBarLabel: "Recent" }} />
    </MaterialTopTabs>
  );
}
