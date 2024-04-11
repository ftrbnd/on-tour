import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function SharedLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="(home)"
        options={{
          tabBarLabel: "Home",
          headerShown: false,
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
          tabBarLabel: "Explore",
          headerShown: false,
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <Ionicons name="search" size={24} color={color} />
            ) : (
              <Ionicons name="search-outline" size={24} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          tabBarLabel: "Me",
          headerShown: false,
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <Ionicons name="person" size={24} color={color} />
            ) : (
              <Ionicons name="person-outline" size={24} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}
