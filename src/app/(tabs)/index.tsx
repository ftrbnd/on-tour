import { Session } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { View } from "react-native";

import Account from "@/src/components/Account";
import Auth from "@/src/components/Auth";
import { supabase } from "@/src/utils/supabase";

export default function Index() {
  const [session, setSession] = useState<Session | null>(null);
  // TODO: Auth context? + fix prettier/eslint

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <View>
      {session && session.user ? <Account key={session.user.id} session={session} /> : <Auth />}
    </View>
  );
}
