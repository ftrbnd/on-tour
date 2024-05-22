import { useQuery } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { PropsWithChildren, createContext, useContext } from "react";

import { getCurrentUser } from "../services/auth";
import { env } from "../utils/env";

interface AuthSession {
  token: string;
  accessToken: string;
}

interface AuthUser {
  displayName: string | null;
  providerId: string;
  avatar: string | null;
  id: string | null;
}

interface AuthContextProps {
  session: AuthSession | null;
  user: AuthUser | null;
  isLoading: boolean;
  isLoaded: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  session: null,
  user: null,
  isLoading: false,
  isLoaded: false,
  signIn: async () => {},
  signOut: async () => {},
});

const API_URL = env.EXPO_PUBLIC_FASTIFY_SERVER_URL;

export function AuthProvider(props: PropsWithChildren) {
  const redirectURL = Linking.createURL("(auth)/sign-in");

  const { data, status, isLoading, refetch } = useQuery({
    queryKey: ["auth"],
    queryFn: getCurrentUser,
    refetchInterval: 3 * 60 * 1000, // 3 minutes
    // refetchOnMount: true by default
    // refetchOnReconnect: true by default
    // refetchOnWindowFocus: true by default
  });

  const signIn = async () => {
    try {
      const result = await WebBrowser.openAuthSessionAsync(
        `${API_URL}/auth/login/spotify`,
        redirectURL,
      );
      if (result.type !== "success") throw new Error("Authentication failed");

      const url = Linking.parse(result.url);
      const sessionToken = url.queryParams?.session_token?.toString() ?? null;

      if (!sessionToken) throw new Error("Missing session token");

      await SecureStore.setItemAsync("session_token", sessionToken);

      await refetch();
    } catch (e) {
      console.error(e);
    }
  };

  const signOut = async () => {
    try {
      const sessionToken = await SecureStore.getItemAsync("session_token");
      if (!sessionToken) throw new Error("Missing session token");

      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      if (!response.ok) throw new Error("Failed to log out");

      await SecureStore.deleteItemAsync("session_token");

      await refetch();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session: data
          ? {
              token: data.session.id,
              accessToken: data.account.accessToken,
            }
          : null,
        user: data
          ? {
              avatar: data.user.avatar,
              displayName: data.user.displayName,
              id: data.user.id,
              providerId: data.account.providerId,
            }
          : null,
        isLoading,
        isLoaded: status !== "pending",
        signIn,
        signOut,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production" && !context) {
    throw new Error("useAuth must be wrapped in a <AuthProvider />");
  }

  return context;
}
