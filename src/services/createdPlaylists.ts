import { env } from "../utils/env";

const ENDPOINT = env.EXPO_PUBLIC_FASTIFY_SERVER_URL;

export interface CreatedPlaylist {
  id: string;
  userId: string;
  title: string;
  setlistId: string;
}

export async function addCreatedPlaylist(
  sessionToken: string | null | undefined,
  body: CreatedPlaylist | null | undefined,
) {
  try {
    if (!sessionToken || !body) throw new Error("Session token and request body required");

    const res = await fetch(`${ENDPOINT}/users/${body.userId}/playlists`, {
      method: "POST",
      body: JSON.stringify({ playlist: body }),
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Failed to store playlist in database");

    const { playlist }: { playlist: CreatedPlaylist } = await res.json();
    return playlist;
  } catch (error) {
    throw error;
  }
}

export async function getCreatedPlaylists(
  sessionToken: string | null | undefined,
  userId: string | null | undefined,
  setlistId?: string | null | undefined,
) {
  try {
    if (!sessionToken || !userId) throw new Error("Session token and user id required");

    const endpoint = setlistId
      ? `${ENDPOINT}/users/${userId}/playlists?setlistId=${setlistId}`
      : `${ENDPOINT}/users/${userId}/playlists`;

    const res = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });
    if (!res.ok) throw new Error("Failed to get user playlists from database");

    const { playlists }: { playlists: CreatedPlaylist[] } = await res.json();
    return playlists;
  } catch (error) {
    throw error;
  }
}

export async function deleteCreatedPlaylist(
  sessionToken: string | null | undefined,
  userId: string | null | undefined,
  playlistId: string | null | undefined,
) {
  try {
    if (!sessionToken || !userId || !playlistId)
      throw new Error("Session token, user id, and playlist id required");

    const res = await fetch(`${ENDPOINT}/users/${userId}/playlists/${playlistId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });
    if (!res.ok) throw new Error("Failed to delete playlist from database");

    // returns 204 No Content
  } catch (error) {
    throw error;
  }
}
