import { env } from "../utils/env";

const ENDPOINT = env.EXPO_PUBLIC_FASTIFY_SERVER_URL;

export interface UpcomingShow {
  id: string;
  userId: string;
  artist: string;
  tour: string;
  venue: string;
  city: string;
  date: string; // YYYY-MM-DD
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

export async function updateUpcomingShow(
  sessionToken: string | null | undefined,
  show: UpcomingShow | null | undefined,
) {
  try {
    if (!sessionToken || !show) throw new Error("Session token and upcoming show required");

    const res = await fetch(`${ENDPOINT}/users/${show.userId}/upcoming/${show.id}`, {
      method: "PATCH",
      body: JSON.stringify({ upcomingShow: show }),
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Failed to delete playlist from database");

    const { upcomingShow }: { upcomingShow: UpcomingShow } = await res.json();
    return upcomingShow;
  } catch (error) {
    throw error;
  }
}

export async function deleteUpcomingShow(
  sessionToken: string | null | undefined,
  show: UpcomingShow | null | undefined,
) {
  try {
    if (!sessionToken || !show) throw new Error("Session token and upcoming show required");

    const res = await fetch(`${ENDPOINT}/users/${show.userId}/upcoming/${show.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });
    if (!res.ok) throw new Error("Failed to delete playlist from database");

    // 204 No Content
  } catch (error) {
    throw error;
  }
}
