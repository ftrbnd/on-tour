import { Artist, Page, Playlist } from "../utils/spotify-types";

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

export async function getOneArtist(token: string | null | undefined, id: string): Promise<Artist> {
  try {
    if (!token) throw Error("Provider token required");

    const res = await fetch(`${ENDPOINT}/artists/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw Error(`Failed to fetch artist with id "${id}"`);

    const artist: Artist = await res.json();
    return artist;
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

export async function searchForArtists(
  token: string | null | undefined,
  query: string,
): Promise<Artist[]> {
  try {
    if (!token) throw Error("Provider token required");
    if (!query) return [];

    const res = await fetch(`${ENDPOINT}/search?q=${query}&type=artist&limit=10`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw Error(`Failed to search for "${query}"`);

    const { artists }: { artists: Page<Artist> } = await res.json();
    return artists.items;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export interface CreatePlaylistRequestBody {
  name: string;
  description?: string;
  public?: boolean;
}

export async function createPlaylist(
  token: string | null | undefined,
  userId: string | undefined,
  body: CreatePlaylistRequestBody,
): Promise<Playlist> {
  try {
    if (!token) throw Error("Provider token required");
    if (!userId) throw Error("User id required");

    const res = await fetch(`${ENDPOINT}/users/${userId}/playlists`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw Error(`Failed to create playlist`);

    const playlist: Playlist = await res.json();
    console.log(playlist);

    return playlist;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
