import { Setlist, Song } from "../utils/setlist-fm-types";
import { Artist, Page, Playlist, SnapshotReference, Track } from "../utils/spotify-types";

const ENDPOINT = `https://api.spotify.com/v1`;

export async function getTopArtists(
  token: string | null | undefined,
  next?: string | null | undefined,
): Promise<{ topArtists: Artist[]; next: string | null }> {
  try {
    if (!token) throw new Error("Access token required");

    const res = await fetch(next ?? `${ENDPOINT}/me/top/artists?limit=10`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error(`Failed to fetch your top artists`);

    const data: Page<Artist> = await res.json();

    return { topArtists: data.items, next: data.next };
  } catch (error) {
    throw error;
  }
}

export async function getOneArtist(token: string | null | undefined, id: string): Promise<Artist> {
  try {
    if (!token) throw new Error("Access token required");

    const res = await fetch(`${ENDPOINT}/artists/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error(`Failed to fetch artist with id "${id}"`);

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
    if (!token) throw new Error("Access token required");

    const res = await fetch(`${ENDPOINT}/artists/${artistId}/related-artists`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error(`Failed to fetch related artists`);

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
    if (!token) throw new Error("Access token required");
    if (!query) return [];

    const res = await fetch(`${ENDPOINT}/search?q=${query}&type=artist&limit=10`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error(`Failed to search for "${query}"`);

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
    if (!token) throw new Error("Access token required");
    if (!userId) throw new Error("User id required");

    const res = await fetch(`${ENDPOINT}/users/${userId}/playlists`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error(`Failed to create playlist`);

    const playlist: Playlist = await res.json();

    return playlist;
  } catch (error) {
    throw error;
  }
}

export async function getTrackFromSetlistFmSong(
  token: string | null | undefined,
  artistToSearch: string | undefined,
  song: Song,
): Promise<Track> {
  if (!token) throw new Error("Access token required");
  if (!artistToSearch) throw new Error("Artist name is required");

  // TODO: find all characters that cause errors
  const sanitizedSongName = song.name.replaceAll(`'`, "");

  try {
    const res = await fetch(
      `${ENDPOINT}/search?q=artist:"${artistToSearch}"%20track:"${sanitizedSongName}"&type=track&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!res.ok) throw new Error(`Failed to search for "${artistToSearch} - ${sanitizedSongName}"`);

    const { tracks }: { tracks: Page<Track> } = await res.json();
    const track = tracks.items[0];

    return track;
  } catch (error) {
    console.log(`No Spotify track found for "${artistToSearch} - ${song.name}"`);
    throw error;
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
  if (!token) throw new Error("Access token required");
  if (body.uris.length === 0) throw new Error("At least one uri is required");

  try {
    const res = await fetch(`${ENDPOINT}/playlists/${body.playlistId}/tracks`, {
      method: "POST",
      body: JSON.stringify({ uris: body.uris }),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error(`Failed to add tracks to playlist`);

    const snapshot: SnapshotReference = await res.json();
    return snapshot.snapshot_id;
  } catch (error) {
    throw error;
  }
}

export async function getOnePlaylist(
  token: string | null | undefined,
  id: string | undefined,
): Promise<Playlist> {
  try {
    if (!token) throw new Error("Access token required");

    const res = await fetch(`${ENDPOINT}/playlists/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error(`Failed to fetch playlist with id "${id}"`);

    const playlist: Playlist = await res.json();
    return playlist;
  } catch (error) {
    throw error;
  }
}

export interface UpdatePlaylistImageRequestBody {
  playlistId: string;
  base64: string | null | undefined;
}

export async function addPlaylistCoverImage(
  token: string | null | undefined,
  body: UpdatePlaylistImageRequestBody,
) {
  try {
    if (!token) throw new Error("Access token required");
    if (!body.base64) throw new Error("Base64 image data required");

    const res = await fetch(`${ENDPOINT}/playlists/${body.playlistId}/images`, {
      method: "PUT",
      body: body.base64,
      headers: {
        "Content-Type": "image/jpeg",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok)
      throw new Error(`Failed to add cover image to playlist with id "${body.playlistId}"`);

    // receive 202 code - Accepted (empty response)
  } catch (error) {
    throw error;
  }
}

export async function getMultipleTracks(
  token: string | null | undefined,
  songs: Song[],
  setlist: Setlist | undefined,
) {
  try {
    if (!token) throw new Error("Access token required");
    if (!setlist) throw new Error("Setlist required");

    const tracks: Track[] = [];

    for (const song of songs) {
      const artistToSearch = song.cover ? song.cover.name : setlist?.artist.name;

      const track = await getTrackFromSetlistFmSong(token, artistToSearch, song);
      tracks.push(track);
    }

    return tracks;
  } catch (error) {
    throw error;
  }
}
