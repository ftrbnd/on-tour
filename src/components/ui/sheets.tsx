import { SheetDefinition, registerSheet } from "react-native-actions-sheet";

import InfoSheet from "./InfoSheet";
import CreatePlaylistSheet from "../Playlist/CreatePlaylistSheet";
import PlaylistExistsSheet from "../Playlist/PlaylistExistsSheet";
import UpcomingShowSheet from "../UpcomingShow/UpcomingShowSheet";

import { UpcomingShow } from "@/src/services/upcomingShows";

registerSheet("create-playlist-sheet", CreatePlaylistSheet);
registerSheet("playlist-exists-sheet", PlaylistExistsSheet);
registerSheet("upcoming-show-sheet", UpcomingShowSheet);
registerSheet("info-sheet", InfoSheet);

declare module "react-native-actions-sheet" {
  interface Sheets {
    "create-playlist-sheet": SheetDefinition<{
      payload: {
        setlistId: string;
        upcomingShowId?: string;
      };
    }>;
    "playlist-exists-sheet": SheetDefinition<{
      payload: {
        playlistId: string | null;
        playlistTitle: string;
      };
    }>;
    "upcoming-show-sheet": SheetDefinition<{
      payload?: UpcomingShow;
    }>;
    "info-sheet": SheetDefinition<{
      payload: {
        title: string;
        description: string;
      };
    }>;
  }
}

export {};
