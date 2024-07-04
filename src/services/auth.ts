import * as SecureStore from "expo-secure-store";

import { env } from "../utils/env";

const API_URL = env.EXPO_PUBLIC_FASTIFY_SERVER_URL;

export interface ServerResponse {
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

interface AnonSession {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export async function getCurrentUser() {
  try {
    const sessionToken = await SecureStore.getItemAsync("session_token");
    if (!sessionToken) return null;

    const res = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });
    if (!res.ok) throw new Error("Invalid session token");

    const data: ServerResponse = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getTokenFromServer() {
  try {
    const res = await fetch(`${API_URL}/auth/client_credentials`);
    if (!res.ok) throw new Error("Failed to get token from server");

    const { access_token }: AnonSession = await res.json();
    return access_token;
  } catch (error) {
    throw error;
  }
}
