import { env } from "../utils/env";

const ENDPOINT = env.EXPO_PUBLIC_FASTIFY_SERVER_URL;

interface StoredPlaylist {
  id: string;
  userId: string;
}

export async function addPlaylist(
  sessionToken: string | null | undefined,
  userId: string | null | undefined,
  playlistId: string | null | undefined,
) {
  try {
    if (!sessionToken || !userId || !playlistId)
      throw new Error("Session token, user id, and playlist id required");

    const res = await fetch(`${ENDPOINT}/users/${userId}/playlists`, {
      method: "POST",
      body: JSON.stringify({ playlistId }),
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Failed to store playlist in database");

    const { playlist }: { playlist: StoredPlaylist } = await res.json();
    return playlist;
  } catch (error) {
    throw error;
  }
}

export async function getPlaylists(
  sessionToken: string | null | undefined,
  userId: string | null | undefined,
) {
  try {
    if (!sessionToken || !userId) throw new Error("Session token and user id required");

    const res = await fetch(`${ENDPOINT}/users/${userId}/playlists`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });
    if (!res.ok) throw new Error("Failed to get user playlists from database");

    const { playlists }: { playlists: StoredPlaylist[] } = await res.json();
    return playlists;
  } catch (error) {
    throw error;
  }
}
