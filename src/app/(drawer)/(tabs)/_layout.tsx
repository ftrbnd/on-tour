import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function SharedLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="(home)"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <Ionicons name="home" size={24} color={color} />
            ) : (
              <Ionicons name="home-outline" size={24} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="(explore)"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <Ionicons name="search" size={24} color={color} />
            ) : (
              <Ionicons name="search-outline" size={24} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="(library)"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <Ionicons name="library" size={24} color={color} />
            ) : (
              <Ionicons name="library-outline" size={24} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}
