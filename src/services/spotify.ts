import { Artist } from "../utils/spotify-types";

const ENDPOINT = `https://api.spotify.com/v1`;

export async function getTopArtists(token: string | null | undefined): Promise<Artist[]> {
  try {
    if (!token) throw Error("Provider token required");

    const res = await fetch(`${ENDPOINT}/me/top/artists?limit=20`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw Error(`Failed to fetch your top artists`);

    const { items }: { items: Artist[] } = await res.json();
    return items;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// https://api.spotify.com/v1/artists/0TnOYISbd1XYRBk9myaseg/related-artists
export async function getRelatedArtists(
  token: string | null | undefined,
  artistId: string | null | undefined,
): Promise<Artist[]> {
  try {
    if (!token) throw Error("Provider token required");

    const res = await fetch(`${ENDPOINT}/artists/${artistId}/related-artists`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw Error(`Failed to fetch related artists`);

    const { artists }: { artists: Artist[] } = await res.json();
    return artists;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
