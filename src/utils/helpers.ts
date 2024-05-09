import { Setlist } from "./setlist-fm-types";
import { UpcomingShow } from "../services/upcomingShows";

export const createPlaylistName = (setlist: Setlist | undefined) => {
  if (!setlist) return "";

  const location = setlist.tour ? setlist.tour.name : setlist.venue?.name;

  return `${setlist.artist?.name} - ${location}`;
};

export const isUpcomingShow = (setlist: Setlist, shows: UpcomingShow[]) => {
  const adjustedDate = `${setlist.eventDate.substring(6)}-${setlist.eventDate.substring(3, 5)}-${setlist.eventDate.substring(0, 2)}`;

  const maybeIsUpcomingShow = shows.find((show) => {
    return (
      show.date === adjustedDate &&
      show.artist.toLowerCase() === setlist.artist.name.toLowerCase() &&
      show.city.toLowerCase() === setlist.venue.city.name.toLowerCase()
    );
  });

  return maybeIsUpcomingShow;
};
