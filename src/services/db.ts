import { env } from "../utils/env";

const ENDPOINT = env.EXPO_PUBLIC_FASTIFY_SERVER_URL;

export interface StoredPlaylist {
  id: string;
  userId: string;
  title: string;
  setlistId: string;
}

export interface UpcomingShow {
  id: string;
  userId: string;
  artist: string;
  tour: string;
  venue: string;
  city: string;
  date: string; // YYYY-MM-DD
}

export async function addPlaylist(
  sessionToken: string | null | undefined,
  userId: string | null | undefined,
  playlistId: string | null | undefined,
  title: string | null | undefined,
  setlistId: string | null | undefined,
) {
  try {
    if (!sessionToken || !userId || !playlistId || !setlistId)
      throw new Error("Session token, user id, playlist id, and setlist id required");

    const res = await fetch(`${ENDPOINT}/users/${userId}/playlists`, {
      method: "POST",
      body: JSON.stringify({ playlistId, title, setlistId }),
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

    const { playlists }: { playlists: StoredPlaylist[] } = await res.json();
    return playlists;
  } catch (error) {
    throw error;
  }
}

export async function deletePlaylist(
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

export async function addUpcomingShow(
  sessionToken: string | null | undefined,
  upcomingShow: Omit<UpcomingShow, "id"> | null | undefined,
) {
  try {
    if (!sessionToken || !upcomingShow) throw new Error("Session token and show details required");

    const res = await fetch(`${ENDPOINT}/users/${upcomingShow.userId}/upcoming`, {
      method: "POST",
      body: JSON.stringify({ upcomingShow }),
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Failed to store playlist in database");

    const { upcomingShow: newUpcomingShow }: { upcomingShow: UpcomingShow } = await res.json();
    return newUpcomingShow;
  } catch (error) {
    throw error;
  }
}

export async function getUpcomingShows(
  sessionToken: string | null | undefined,
  userId: string | null | undefined,
) {
  try {
    if (!sessionToken || !userId) throw new Error("Session token and user id required");

    const res = await fetch(`${ENDPOINT}/users/${userId}/upcoming`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });
    if (!res.ok) throw new Error("Failed to delete playlist from database");

    const { upcomingShows }: { upcomingShows: UpcomingShow[] } = await res.json();
    return upcomingShows;
  } catch (error) {
    throw error;
  }
}
