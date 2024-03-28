import { useQuery } from "@tanstack/react-query";
import { Drawer } from "expo-router/drawer";
import { View, StyleSheet } from "react-native";
import { Avatar, List } from "react-native-paper";

import { useAuth } from "@/src/providers/AuthProvider";
import { getPlaylists } from "@/src/services/db";

const styles = StyleSheet.create({
  container: {
    padding: 8,
    display: "flex",
    alignItems: "center",
  },
  headerRight: {
    marginRight: 16,
  },
});

export default function Profile() {
  const { user, session } = useAuth();

  const { data: playlists } = useQuery({
    queryKey: ["created-playlists"],
    queryFn: () => getPlaylists(session?.token, user?.id),
    enabled: user !== null,
  });

  return (
    <>
      <Drawer.Screen
        options={{
          drawerLabel: "My Library",
          title: user ? user.displayName ?? user.providerId : "My Library",
          headerRight: () =>
            user ? (
              <Avatar.Image size={36} source={{ uri: user?.avatar ?? "" }} />
            ) : (
              <Avatar.Icon size={36} icon="account" />
            ),
          headerRightContainerStyle: styles.headerRight,
        }}
      />

      <View>
        <List.AccordionGroup>
          <List.Accordion title="My Playlists" id="1">
            {playlists?.map((playlist) => <List.Item key={playlist.id} title={playlist.id} />)}
          </List.Accordion>
          <List.Accordion title="Upcoming Shows" id="2">
            <List.Item title="Item 2" />
          </List.Accordion>
        </List.AccordionGroup>
      </View>
    </>
  );
}
