import {
  RefreshTokenRequestConfig,
  TokenResponse,
  TokenResponseConfig,
  exchangeCodeAsync,
  fetchUserInfoAsync,
  makeRedirectUri,
  useAuthRequest,
} from "expo-auth-session";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";

import { useSecureStore } from "../hooks/useSecureStore";
import { env } from "../utils/env";
import { User } from "../utils/spotify-types";

interface Session {
  accessToken: string | null;
  user: User | null;
}

interface AuthContextProps {
  session: Session | null;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  session: null,
  signIn: () => {},
  signOut: () => {},
});

const requestConfig = {
  redirectUri: makeRedirectUri({
    native: "on.tour://",
  }),
  discovery: {
    authorizationEndpoint: "https://accounts.spotify.com/authorize",
    tokenEndpoint: "https://accounts.spotify.com/api/token",
  },
};

export function AuthProvider(props: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [[, tokenConfig], setTokenConfig] = useSecureStore("token_config");

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID,
      clientSecret: env.EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET,
      redirectUri: requestConfig.redirectUri,
      scopes: [
        "user-follow-read",
        "user-top-read",
        "playlist-modify-public",
        "playlist-modify-private",
      ],
      usePKCE: false,
    },
    {
      authorizationEndpoint: requestConfig.discovery.authorizationEndpoint,
      tokenEndpoint: requestConfig.discovery.tokenEndpoint,
    },
  );

  useEffect(() => {
    readTokenFromStorage();
    // TODO: created expiresAt state to run in separate useEffect to refresh tokens

    if (response?.type === "success") {
      const { code } = response.params;
      if (code) {
        exchangeCodeForToken(code);
      }
    }
  }, [response, tokenConfig]);

  const updateContext = async (tokenResponse: TokenResponse) => {
    try {
      const tokenConfig = tokenResponse.getRequestConfig();
      const { accessToken } = tokenConfig;

      const user = (await fetchUserInfoAsync(
        { accessToken },
        { userInfoEndpoint: "https://api.spotify.com/v1/me" },
      )) as User;

      // TODO: add user info to db on sign-up

      setTokenConfig(JSON.stringify(tokenConfig));
      setSession({ accessToken, user });
    } catch (error) {
      console.error("updateContext()", error);
    }
  };

  const readTokenFromStorage = async () => {
    if (!tokenConfig) return;
    console.log(`readTokenFromStorage()`);

    try {
      const config: TokenResponseConfig = JSON.parse(tokenConfig);

      let tokenResponse = new TokenResponse(config);

      if (tokenResponse.shouldRefresh()) {
        const refreshConfig: RefreshTokenRequestConfig = {
          clientId: env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID,
          clientSecret: env.EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET,
          refreshToken: config.refreshToken,
        };

        tokenResponse = await tokenResponse.refreshAsync(refreshConfig, {
          tokenEndpoint: requestConfig.discovery.tokenEndpoint,
        });
      }

      updateContext(tokenResponse);
    } catch (error) {
      console.error("readTokenFromStorage()", error);
    }
  };

  const signIn = async () => {
    try {
      await promptAsync();
    } catch (error) {
      console.error("signIn()", error);
    }
  };

  const exchangeCodeForToken = async (code: string) => {
    console.log(`exchangeCodeForToken()`);

    try {
      const tokenResponse: TokenResponse = await exchangeCodeAsync(
        {
          clientId: env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID,
          clientSecret: env.EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET,
          code,
          extraParams: request?.codeVerifier ? { code_verifier: request?.codeVerifier } : undefined,
          redirectUri: requestConfig.redirectUri,
        },
        {
          tokenEndpoint: requestConfig.discovery.tokenEndpoint,
        },
      );
      if (!tokenResponse) throw new Error("No token response from code");

      updateContext(tokenResponse);
    } catch (error) {
      console.error("exchangeCodeForToken()", error);
    }
  };

  const signOut = async () => {
    try {
      setSession(null);
    } catch (error) {
      console.error("signOut()", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
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
