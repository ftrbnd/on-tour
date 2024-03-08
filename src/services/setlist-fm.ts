import { env } from "../utils/env";
import { Setlist, Setlists } from "../utils/setlist-fm-types";

const ENDPOINT = "https://api.setlist.fm/rest/1.0";

export async function searchArtistSetlist(query: string): Promise<Setlist[]> {
  try {
    const res = await fetch(`${ENDPOINT}/search/setlists?artistName=${query}`, {
      headers: {
        Accept: "application/json",
        "x-api-key": env.EXPO_PUBLIC_SETLIST_FM_API_KEY,
      },
    });
    if (!res.ok) throw Error(`Failed to fetch "${query}" from setlist.fm`);

    const setlists: Setlists = await res.json();
    return setlists.setlist;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
