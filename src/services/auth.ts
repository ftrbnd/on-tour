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
