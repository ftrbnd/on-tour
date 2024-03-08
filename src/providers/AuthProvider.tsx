import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AuthSession } from "@supabase/supabase-js";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import { openAuthSessionAsync } from "expo-web-browser";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { AppState } from "react-native";

import { env } from "../utils/env";
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
  const [providerRefreshToken, setProviderRefreshToken] = useState<string | null>(null);
  const [providerExpiresIn, setProviderExpiresIn] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const createSessionFromUrl = async (url: string) => {
    const { params, errorCode } = QueryParams.getQueryParams(url);
    if (errorCode) throw new Error(errorCode);

    const { access_token, refresh_token, provider_token, provider_refresh_token, expires_in } =
      params;
    if (!access_token) return;

    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    if (error) throw error;

    await AsyncStorage.setItem("spotify_access_token", provider_token);
    await AsyncStorage.setItem("spotify_refresh_token", provider_refresh_token);

    setProviderToken(provider_token);
    setProviderRefreshToken(provider_refresh_token);
    setProviderExpiresIn(parseInt(expires_in, 10));

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
    setProviderToken(null);
    setProviderRefreshToken(null);
    setProviderExpiresIn(null);

    await AsyncStorage.removeItem("spotify_access_token");
    await AsyncStorage.removeItem("spotify_refresh_token");

    if (error) {
      console.error(error);
    }
  };

  const getTokens = async () => {
    try {
      const spotifyAccessToken = await AsyncStorage.getItem("spotify_access_token");
      const spotifyRefreshToken = await AsyncStorage.getItem("spotify_refresh_token");

      if (spotifyAccessToken && spotifyRefreshToken) {
        setProviderToken(spotifyAccessToken);
        setProviderRefreshToken(spotifyRefreshToken);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    getTokens();

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

  useEffect(() => {
    if (!providerRefreshToken || !providerExpiresIn) return;
    // https://developer.spotify.com/documentation/web-api/tutorials/refreshing-tokens
    const interval = setInterval(
      async () => {
        const body = await fetch('https://accounts.spotify.com/api/token"', {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: providerRefreshToken,
            client_id: env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID,
          }),
        });

        const response = await body.json();
        setProviderToken(response.accessToken);
      },
      (providerExpiresIn - 60) * 1000,
    );

    return () => clearInterval(interval);
  }, [providerRefreshToken, providerExpiresIn]);

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
