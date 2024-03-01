import { Session } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { View } from "react-native";
import { Button, Snackbar, TextInput } from "react-native-paper";

import { supabase } from "../utils/supabase";

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) {
        setShowToast(true);
        setToastMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string;
    website: string;
    avatar_url: string;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        setShowToast(true);
        setToastMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const toggleVisibility = () => {
    setShowToast((prev) => !prev);
  };

  return (
    <View>
      <Snackbar visible={showToast} onDismiss={toggleVisibility}>
        {toastMessage}
      </Snackbar>
      <View>
        <TextInput label="Email" value={session?.user?.email} disabled />
      </View>
      <View>
        <TextInput
          label="Username"
          value={username || ""}
          onChangeText={(text) => setUsername(text)}
        />
      </View>
      <View>
        <TextInput
          label="Website"
          value={website || ""}
          onChangeText={(text) => setWebsite(text)}
        />
      </View>

      <View>
        <Button
          onPress={() =>
            updateProfile({
              username,
              website,
              avatar_url: avatarUrl,
            })
          }
          disabled={loading}>
          {loading ? "Loading ..." : "Update"}
        </Button>
      </View>

      <View>
        <Button onPress={() => supabase.auth.signOut()}>Sign Out</Button>
      </View>
    </View>
  );
}
