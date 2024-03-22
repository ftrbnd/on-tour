import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";

import { env } from "../utils/env";

type Session = {
  id: string;
};

type User = {
  displayName: string | null;
  avatar: string | null;
};

type Account = {
  providerId: string;
  accessToken: string;
};

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  account: Account | null;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  session: null,
  user: null,
  account: null,
  signIn: () => {},
  signOut: () => {},
});

const API_URL = env.EXPO_PUBLIC_FASTIFY_SERVER_URL;

export function AuthProvider(props: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [account, setAccount] = useState<Account | null>(null);

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
    console.log(`Updating context... ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`);

    try {
      const sessionToken = await SecureStore.getItemAsync("session_token");
      const accessToken = await SecureStore.getItemAsync("access_token");

      if (sessionToken && accessToken) {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        });
        if (!res.ok) return null;

        const { session, user, account }: { session: Session; user: User; account: Account } =
          await res.json();

        console.log({ session, user, account });

        setSession(session);
        setUser(user);
        setAccount(account);
      } else {
        setSession(null);
        setUser(null);
        setAccount(null);
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
      if (result.type !== "success") return;

      const url = Linking.parse(result.url);
      const sessionToken = url.queryParams?.session_token?.toString() ?? null;
      const accessToken = url.queryParams?.access_token?.toString() ?? null;

      if (!sessionToken || !accessToken) return;

      await SecureStore.setItemAsync("session_token", sessionToken);
      await SecureStore.setItemAsync("access_token", accessToken);

      await updateContext();
    } catch (e) {
      console.error(e);
    }
  };

  const signOut = async () => {
    try {
      const sessionToken = await SecureStore.getItemAsync("session_token");
      if (!sessionToken) return;

      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      if (!response.ok) return;

      await SecureStore.deleteItemAsync("session_token");
      await SecureStore.deleteItemAsync("access_token");

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
        account,
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
