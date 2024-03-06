import type { AuthSession } from "@supabase/supabase-js";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import { openAuthSessionAsync } from "expo-web-browser";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { AppState } from "react-native";

import { supabase } from "../utils/supabase";

interface AuthUser {
  avatar_url: string;
  email: string;
  username: string;
}

interface AuthContextProps {
  session: AuthSession | null;
  user: AuthUser | null;
  isLoading: boolean;
  error: string;
  signIn: () => void;
  signOut: () => void;
}

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export const AuthContext = createContext<AuthContextProps>({
  session: null,
  user: null,
  isLoading: false,
  error: "",
  signIn: () => {},
  signOut: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const createSessionFromUrl = async (url: string) => {
    const { params, errorCode } = QueryParams.getQueryParams(url);
    if (errorCode) throw new Error(errorCode);

    const { access_token, refresh_token } = params;
    if (!access_token) return;

    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    if (error) throw error;

    return data.session;
  };

  const signIn = async () => {
    try {
      setIsLoading(true);

      const redirectTo = makeRedirectUri();

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "spotify",
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });
      if (error) throw error;

      const res = await openAuthSessionAsync(data?.url ?? "", redirectTo);

      if (res.type === "success") {
        const { url } = res;
        const session = await createSessionFromUrl(url);

        if (!session) throw Error("Session not found");

        setSession(session);
        setUser({
          avatar_url: session.user.user_metadata.avatar_url,
          email: session.user.user_metadata.email,
          username: session.user.user_metadata.full_name,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  async function signOut() {
    const { error } = await supabase.auth.signOut();

    setSession(null);
    setUser(null);

    if (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser({
        avatar_url: user?.user_metadata.avatar_url,
        email: user?.user_metadata.email,
        username: user?.user_metadata.full_name,
      });
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      if (session?.user) {
        setUser({
          avatar_url: session.user.user_metadata.avatar_url,
          email: session.user.user_metadata.email,
          username: session.user.user_metadata.full_name,
        });
      } else {
        setUser(null);
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading,
        error,
        signIn,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
