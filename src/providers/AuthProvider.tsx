import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";

import { env } from "../utils/env";

interface ServerResponse {
  session: {
    id: string;
  };
  account: {
    providerId: string;
    accessToken: string;
  };
  user: {
    displayName: string | null;
    avatar: string | null;
    id: string | null;
  };
}

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
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  session: null,
  user: null,
  signIn: () => {},
  signOut: () => {},
});

const API_URL = env.EXPO_PUBLIC_FASTIFY_SERVER_URL;

export function AuthProvider(props: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  const redirectURL = Linking.createURL("profile");

  useEffect(() => {
    updateContext();

    const interval = setInterval(
      () => {
        updateContext();
      },
      30 * 60 * 1000,
    ); // 30 minutes

    return () => clearInterval(interval);
  }, []);

  const updateContext = async () => {
    const now = new Date();
    console.log(`Updating context at ${now.toLocaleTimeString()}`);

    try {
      const sessionToken = await SecureStore.getItemAsync("session_token");

      if (sessionToken) {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        });
        if (!res.ok) throw new Error("Invalid session token");

        const { session, user, account }: ServerResponse = await res.json();

        setSession({
          token: session.id,
          accessToken: account.accessToken,
        });
        setUser({
          displayName: user.displayName,
          providerId: account.providerId,
          avatar: user.avatar,
          id: user.id,
        });
      } else {
        setSession(null);
        setUser(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

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

      await updateContext();
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

      await updateContext();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
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
