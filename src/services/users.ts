import { env } from "../utils/env";

const ENDPOINT = env.EXPO_PUBLIC_FASTIFY_SERVER_URL;

export async function deleteUserData(
  sessionToken: string | null | undefined,
  userId: string | null | undefined,
) {
  try {
    if (!sessionToken || !userId) throw new Error("Session token and user id required");

    const res = await fetch(`${ENDPOINT}/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });
    if (!res.ok) throw new Error("Failed to delete user from database");

    // returns 204 No Content
  } catch (error) {
    throw error;
  }
}
