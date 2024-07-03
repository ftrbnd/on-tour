import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BottomNavigation, BottomNavigationTab, Icon, useTheme } from "@ui-kitten/components";
import { Tabs } from "expo-router";

import { useAuth } from "@/src/providers/AuthProvider";

const BottomTabBar = ({ navigation, state }: BottomTabBarProps) => {
  const { session } = useAuth();
  const theme = useTheme();

  return (
    <BottomNavigation
      appearance={session ? "default" : "noIndicator"}
      style={{
        marginTop: -1,
        borderColor: session ? undefined : theme["color-primary-default"],
        borderTopWidth: session ? undefined : 3,
      }}
      selectedIndex={state.index}
      onSelect={(index) => navigation.navigate(state.routeNames[index])}>
      <BottomNavigationTab icon={<Icon name="home-outline" />} />
      {session ? <BottomNavigationTab icon={<Icon name="search-outline" />} /> : <></>}
      {session ? <BottomNavigationTab icon={<Icon name="book-outline" />} /> : <></>}
    </BottomNavigation>
  );
};

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
