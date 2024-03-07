import { env } from "../utils/env";

const ENDPOINT = `https://api.spotify.com/v1`;

// TODO: refresh access token?

export async function getTopArtists(token: string | null | undefined) {
  try {
    if (!token) throw Error("Provider token required");
    console.log({ token });

    const res = await fetch(
      `${ENDPOINT}/me/top/artists?client_id=${env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID}&scope=user-top-read`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!res.ok) throw Error(`Failed to fetch your top artists`);

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}
