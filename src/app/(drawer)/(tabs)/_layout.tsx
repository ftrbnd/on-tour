import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BottomNavigation, BottomNavigationTab, Icon } from "@ui-kitten/components";
import { Tabs } from "expo-router";

const BottomTabBar = ({ navigation, state }: BottomTabBarProps) => (
  <BottomNavigation
    style={{ marginTop: -1 }}
    selectedIndex={state.index}
    onSelect={(index) => navigation.navigate(state.routeNames[index])}>
    <BottomNavigationTab icon={<Icon name="home-outline" />} />
    <BottomNavigationTab icon={<Icon name="search-outline" />} />
    <BottomNavigationTab icon={<Icon name="book-outline" />} />
  </BottomNavigation>
);

export default function SharedLayout() {
  return (
    <Tabs tabBar={(props) => <BottomTabBar {...props} />}>
      <Tabs.Screen
        name="(home)"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="(explore)"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="(library)"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />
    </Tabs>
  );
}
