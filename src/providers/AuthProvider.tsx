import {
  CodeChallengeMethod,
  TokenResponse,
  TokenResponseConfig,
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
} from "expo-auth-session";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";

import { useStorageState } from "../hooks/useStorageState";
import { env } from "../utils/env";

const AuthContext = createContext<{
  providerToken: string | null;
  signIn: () => void;
}>({
  providerToken: null,
  signIn: () => {},
});

const redirectUri = makeRedirectUri({
  scheme: "on.tour",
});

const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const tokenEndpoint = "https://accounts.spotify.com/api/token";

const discovery = {
  authorizationEndpoint,
  tokenEndpoint,
};

// const generateRandomString = (length: number) => {
//   const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   const values = getRandomValues(new Uint8Array(length));
//   return values.reduce((acc, x) => acc + possible[x % possible.length], "");
// };

// const codeVerifier = generateRandomString(64);

// const sha256Hash = async (plain: string) => {
//   const data = Buffer.from(plain, "utf-8");
//   return digest(CryptoDigestAlgorithm.SHA256, data);
// };

// const base64encode = (input: ArrayBuffer) => {
//   const buf = Buffer.from(String.fromCharCode(...new Uint8Array(input)), "base64");
//   const a = buf.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

//   return a;
// };

// This hook can be used to access the user info.
export function useAuth() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useAuth must be wrapped in a <AuthProvider />");
    }
  }

  return value;
}

export function AuthProvider(props: PropsWithChildren) {
  const [[, accessToken], setAccessToken] = useStorageState("access_token");
  const [[, refreshToken], setRefreshToken] = useStorageState("refresh_token");

  const [codeChallenge, setCodeChallenge] = useState<string>();

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID,
      scopes: [
        "user-follow-read",
        "user-top-read",
        "playlist-modify-public",
        "playlist-modify-private",
      ],
      usePKCE: false,
      redirectUri,
      responseType: "code",
      codeChallengeMethod: CodeChallengeMethod.S256,
      codeChallenge,
    },
    discovery,
  );

  // const readTokenFromStorage = async () => {
  //   const tokenConfig: TokenResponseConfig = JSON.parse(tokenString);
  //   if (tokenConfig) {
  //     // instantiate a new token response object which will allow us to refresh
  //     let tokenResponse = new TokenResponse(tokenConfig);

  //     // shouldRefresh checks the expiration and makes sure there is a refresh token
  //     if (tokenResponse.shouldRefresh()) {
  //       // All we need here is the clientID and refreshToken because the function handles setting our grant type based on
  //       // the type of request configuration (refreshtokenrequestconfig in our example)
  //       const refreshConfig: RefreshTokenRequestConfig = {
  //         clientId: auth0ClientId,
  //         refreshToken: tokenConfig.refreshToken,
  //       };
  //       const endpointConfig: Pick<AuthSession.DiscoveryDocument, "tokenEndpoint"> = {
  //         tokenEndpoint,
  //       };

  //       // pass our refresh token and get a new access token and new refresh token
  //       tokenResponse = await tokenResponse.refreshAsync(refreshConfig, endpointConfig);
  //     }
  //     // cache the token for next time
  //     setToken(JSON.stringify(tokenResponse.getRequestConfig()));

  //     // decode the jwt for getting profile information
  //     const decoded = jwtDecode(tokenResponse.accessToken);
  //     // storing token in state
  //     setUser({ jwtToken: tokenResponse.accessToken, decoded });
  //   }
  // };

  const getToken = async (code: string) => {
    try {
      console.log("exchanging code for token...");

      const tokenResponse: TokenResponse = await exchangeCodeAsync(
        {
          code,
          redirectUri,
          clientId: env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID,
          extraParams: request?.codeVerifier ? { code_verifier: request?.codeVerifier } : undefined,
        },
        { tokenEndpoint },
      );
      console.log({ tokenResponse });

      // get the config from our response to cache for later refresh
      const tokenConfig: TokenResponseConfig = tokenResponse?.getRequestConfig();
      console.log({ tokenConfig });

      // get the access token to use
      const token = tokenConfig.accessToken;
      setAccessToken(token);

      // caching the token for later
      // setToken(JSON.stringify(tokenConfig));

      // decoding the token for getting user profile information
      // const decoded = jwtDecode(jwtToken);
      // setUser({ jwtToken, decoded })
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // readTokenFromStorage();
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      console.log({ response });

      const { code } = response.params;
      console.log({ code });

      if (code) {
        getToken(code);
      }
    }
  }, [response]);

  const signIn = async () => {
    try {
      await promptAsync();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        providerToken: accessToken,
        signIn,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
}
