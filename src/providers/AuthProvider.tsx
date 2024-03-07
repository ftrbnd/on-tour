import AsyncStorage from "@react-native-async-storage/async-storage";
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
  providerToken: string | null;
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
  providerToken: null,
  isLoading: false,
  error: "",
  signIn: () => {},
  signOut: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

const redirectTo = makeRedirectUri();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [providerToken, setProviderToken] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const createSessionFromUrl = async (url: string) => {
    const { params, errorCode } = QueryParams.getQueryParams(url);
    if (errorCode) throw new Error(errorCode);

    const { access_token, refresh_token, provider_token, provider_refresh_token } = params;
    if (!access_token) return;

    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    await AsyncStorage.setItem("oauth_provider_token", provider_token);
    await AsyncStorage.setItem("oauth_provider_refresh_token", provider_refresh_token);
    if (error) throw error;

    return data.session;
  };

  const signIn = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "spotify",
        options: {
          redirectTo,
          skipBrowserRedirect: true,
          scopes: "user-follow-read user-top-read",
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

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    setSession(null);
    setUser(null);

    await AsyncStorage.removeItem("oauth_provider_token");
    await AsyncStorage.removeItem("oauth_provider_refresh_token");

    if (error) {
      console.error(error);
    }
  };

  const getAccessToken = async () => {
    try {
      const token = await AsyncStorage.getItem("oauth_provider_token");
      return token;
    } catch (error: unknown) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAccessToken().then((token) => {
      if (token) setProviderToken(token);
    });

    supabase.auth.onAuthStateChange(async (_event, session) => {
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
        providerToken,
        isLoading,
        error,
        signIn,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
