import { Song } from "../utils/setlist-fm-types";
import { Artist, Page, Playlist, SnapshotReference, Track } from "../utils/spotify-types";

const ENDPOINT = `https://api.spotify.com/v1`;

export async function getTopArtists(
  token: string | null | undefined,
  next?: string | null | undefined,
): Promise<{ topArtists: Artist[]; next: string | null }> {
  try {
    if (!token) throw Error("Access token required");

    const res = await fetch(next ?? `${ENDPOINT}/me/top/artists?limit=10`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw Error(`Failed to fetch your top artists`);

    const data: Page<Artist> = await res.json();

    return { topArtists: data.items, next: data.next };
  } catch (error) {
    throw error;
  }
}

export async function getOneArtist(token: string | null | undefined, id: string): Promise<Artist> {
  try {
    if (!token) throw Error("Access token required");

    const res = await fetch(`${ENDPOINT}/artists/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw Error(`Failed to fetch artist with id "${id}"`);

    const artist: Artist = await res.json();
    return artist;
  } catch (error) {
    throw error;
  }
}

// https://api.spotify.com/v1/artists/0TnOYISbd1XYRBk9myaseg/related-artists
export async function getRelatedArtists(
  token: string | null | undefined,
  artistId: string | null | undefined,
): Promise<Artist[]> {
  try {
    if (!token) throw Error("Access token required");

    const res = await fetch(`${ENDPOINT}/artists/${artistId}/related-artists`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw Error(`Failed to fetch related artists`);

    const { artists }: { artists: Artist[] } = await res.json();
    return artists;
  } catch (error) {
    throw error;
  }
}

export async function searchForArtists(
  token: string | null | undefined,
  query: string,
): Promise<Artist[]> {
  try {
    if (!token) throw Error("Access token required");
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
    if (!token) throw Error("Access token required");
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

    return playlist;
  } catch (error) {
    throw error;
  }
}

export async function getUriFromSetlistFmSong(
  token: string | null | undefined,
  artistToSearch: string | undefined,
  song: Song,
): Promise<string> {
  if (!token) throw Error("Access token required");
  if (!artistToSearch) throw Error("Artist name is required");

  try {
    const res = await fetch(
      `${ENDPOINT}/search?q=artist:"${artistToSearch}" track:"${song.name}"&type=track&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!res.ok) throw Error(`Failed to search for "${artistToSearch} - ${song.name}"`);

    const { tracks }: { tracks: Page<Track> } = await res.json();
    const uri = tracks.items[0].uri;

    return uri;
  } catch (error) {
    throw Error(`No uri found for "${artistToSearch} - ${song.name}"`);
  }
}

export interface UpdatePlaylistRequestBody {
  playlistId: string;
  uris: string[];
  expected?: number;
  found?: number;
}

export async function addSongsToPlaylist(
  token: string | null | undefined,
  body: UpdatePlaylistRequestBody,
) {
  if (!token) throw Error("Access token required");
  if (body.uris.length === 0) throw Error("At least one uri is required");

  try {
    const res = await fetch(`${ENDPOINT}/playlists/${body.playlistId}/tracks`, {
      method: "POST",
      body: JSON.stringify({ uris: body.uris }),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw Error(`Failed to add tracks to playlist`);

    const snapshot: SnapshotReference = await res.json();
    return snapshot.snapshot_id;
  } catch (error) {
    throw error;
  }
}
