import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";

import { useSecureStore } from "../hooks/useSecureStore";
import { User as SpotifyUser } from "../utils/spotify-types";

interface Session {
  sessionToken: string;
  accessToken: string;
}

interface AuthContextProps {
  session: Session | null;
  user: SpotifyUser | null;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  session: null,
  user: null,
  signIn: () => {},
  signOut: () => {},
});

const apiUrl = "http://localhost:3000/api";

export function AuthProvider(props: PropsWithChildren) {
  const [[, sessionToken], setSessionToken] = useSecureStore("session_token");
  const [[, accessToken], setAccessToken] = useSecureStore("access_token");

  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SpotifyUser | null>(null);

  const redirectURL = Linking.createURL("profile");

  const getUser = async (accessToken: string): Promise<SpotifyUser | null> => {
    const res = await fetch(`https://api.spotify.com/v1/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!res.ok) return null;

    return await res.json();
  };

  const signIn = async () => {
    try {
      const result = await WebBrowser.openAuthSessionAsync(
        `${apiUrl}/auth/login/spotify`,
        redirectURL,
      );
      if (result.type !== "success") return;

      const url = Linking.parse(result.url);
      const sessionToken = url.queryParams?.session_token?.toString() ?? null;
      const accessToken = url.queryParams?.access_token?.toString() ?? null;

      if (!sessionToken || !accessToken) return;
      const user = await getUser(accessToken);

      setSessionToken(sessionToken);
      setAccessToken(accessToken);
      setUser(user);
    } catch (e) {
      console.error(e);
    }
  };

  const signOut = async () => {
    const response = await fetch(`${apiUrl}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    if (!response.ok) return;

    setSessionToken(null);
    setAccessToken(null);
    setUser(null);
  };

  // TODO: does the backend handle refreshing of access tokens?
  useEffect(() => {
    const setup = async () => {
      let user: SpotifyUser | null = null;

      if (accessToken) {
        user = await getUser(accessToken);
      }

      setUser(user);
    };

    setup();
  }, []);

  useEffect(() => {
    if (sessionToken && accessToken) {
      setSession({ sessionToken, accessToken });
    } else {
      setSession(null);
    }
  }, [sessionToken, accessToken]);

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
