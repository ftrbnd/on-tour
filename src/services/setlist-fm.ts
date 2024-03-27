import moment from "moment";

import { env } from "../utils/env";
import { Setlist, Setlists } from "../utils/setlist-fm-types";
import { Artist } from "../utils/spotify-types";

const ENDPOINT = "https://api.setlist.fm/rest/1.0";

export async function searchArtistSetlist(
  query: string | undefined,
  page?: number,
): Promise<{ setlists: Setlist[]; nextPage?: number }> {
  try {
    if (!query) return { setlists: [] };

    const res = await fetch(`${ENDPOINT}/search/setlists?artistName=${query}&p=${page ?? 1}`, {
      headers: {
        Accept: "application/json",
        "x-api-key": env.EXPO_PUBLIC_SETLIST_FM_API_KEY,
      },
    });
    if (!res.ok) throw new Error(`Failed to fetch "${query}" from setlist.fm`);

    const setlists: Setlists = await res.json();

    const nonEmpty = setlists.setlist
      .filter((s) => s.sets.set.length > 0)
      .sort((a, b) => {
        return (
          moment(b.eventDate, "DD-MM-YYYY").valueOf() - moment(a.eventDate, "DD-MM-YYYY").valueOf()
        );
      });

    return {
      setlists: nonEmpty,
      nextPage: setlists.page + 1,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getOneSetlist(id: string | undefined): Promise<Setlist> {
  try {
    if (!id) throw new Error("Setlist id required");

    const res = await fetch(`${ENDPOINT}/setlist/${id}`, {
      headers: {
        Accept: "application/json",
        "x-api-key": env.EXPO_PUBLIC_SETLIST_FM_API_KEY,
      },
    });
    if (!res.ok) throw new Error(`Failed to fetch setlist with id "${id}" from setlist.fm`);

    const data: Setlist = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getRecentShows(artists: Artist[] | undefined): Promise<Setlist[]> {
  try {
    if (!artists) throw new Error("Artists are required");
    if (artists.length === 0) return [];

    const recentSetlists: Setlist[] = [];

    for (const artist of artists) {
      const { setlists } = await searchArtistSetlist(artist.name);
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
