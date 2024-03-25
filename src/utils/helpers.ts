import { Setlist } from "./setlist-fm-types";

export const createPlaylistName = (setlist: Setlist | undefined) => {
  if (!setlist) return "";

  const location = setlist.tour ? setlist.tour.name : setlist.venue?.name;

  return `${setlist.artist?.name} - ${location}`;
};
