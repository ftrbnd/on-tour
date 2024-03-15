import moment from "moment";

import { env } from "../utils/env";
import { Setlist, Setlists } from "../utils/setlist-fm-types";
import { Artist } from "../utils/spotify-types";

const ENDPOINT = "https://api.setlist.fm/rest/1.0";

export async function searchArtistSetlist(query: string | undefined): Promise<Setlist[]> {
  try {
    if (!query) return [];

    const res = await fetch(`${ENDPOINT}/search/setlists?artistName=${query}`, {
      headers: {
        Accept: "application/json",
        "x-api-key": env.EXPO_PUBLIC_SETLIST_FM_API_KEY,
      },
    });
    if (!res.ok) throw Error(`Failed to fetch "${query}" from setlist.fm`);

    const setlists: Setlists = await res.json();
    const nonEmpty = setlists.setlist.filter((s) => s.sets.set.length > 0);

    return nonEmpty;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getOneSetlist(id: string | undefined): Promise<Setlist> {
  try {
    if (!id) throw Error("Setlist id required");

    const res = await fetch(`${ENDPOINT}/setlist/${id}`, {
      headers: {
        Accept: "application/json",
        "x-api-key": env.EXPO_PUBLIC_SETLIST_FM_API_KEY,
      },
    });
    if (!res.ok) throw Error(`Failed to fetch setlist with id "${id}" from setlist.fm`);

    const data: Setlist = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getRecentShows(artists: Artist[] | undefined): Promise<Setlist[]> {
  try {
    if (!artists) throw Error("Artists are required");
    if (artists.length === 0) return [];

    const recentSetlists: Setlist[] = [];

    for (const artist of artists) {
      const setlists = await searchArtistSetlist(artist.name);
      recentSetlists.push(...setlists);
    }

    return recentSetlists.sort((a, b) => {
      return (
        moment(b.eventDate, "DD-MM-YYYY").valueOf() - moment(a.eventDate, "DD-MM-YYYY").valueOf()
      );
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
