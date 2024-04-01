import { useMutation } from "@tanstack/react-query";
import { ImagePickerAsset } from "expo-image-picker";
import { openBrowserAsync } from "expo-web-browser";
import moment from "moment";
import { useEffect, useState } from "react";

import useSetlist from "./useSetlist";
import useStoredPlaylist from "./useStoredPlaylist";
import { useAuth } from "../providers/AuthProvider";
import {
  CreatePlaylistRequestBody,
  createPlaylist,
  UpdatePlaylistRequestBody,
  addSongsToPlaylist,
  UpdatePlaylistImageRequestBody,
  addPlaylistCoverImage,
} from "../services/spotify";
import { createPlaylistName } from "../utils/helpers";
import { storage } from "../utils/mmkv";
import { Playlist, TrackItem } from "../utils/spotify-types";

export default function usePlaylist(setlistId: string) {
  const { data: setlist, songs, spotifyTracks } = useSetlist(setlistId);
  const { session, user } = useAuth();

  const [playlist, setPlaylist] = useState<Playlist<TrackItem> | null>(null);
  const { addToDatabase } = useStoredPlaylist({ playlistId: playlist?.id });

  const [name, setName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [image, setImage] = useState<ImagePickerAsset | null>(null);

  const [addedTracks, setAddedTracks] = useState<boolean>(false);
  const [tracksFound, setTracksFound] = useState<number | null>(null);

  const createPlaylistMutation = useMutation({
    mutationFn: (body: CreatePlaylistRequestBody) =>
      createPlaylist(session?.accessToken, user?.providerId, body),
    onSuccess: async (playlist) => {
      console.log("Playlist created!");
      setPlaylist(playlist);
      await handleUpdatePlaylist(playlist);
    },
    onError: (error) => {
      console.error("Create mutation failed", error);
    },
  });

  const updatePlaylistTracksMutation = useMutation({
    mutationFn: (body: UpdatePlaylistRequestBody) =>
      addSongsToPlaylist(session?.accessToken, { playlistId: body.playlistId, uris: body.uris }),
    onSuccess: async (_updatedPlaylist, body) => {
      setTracksFound(body.found ?? null);
      setAddedTracks(true);
      // TODO: show this message as an alert?
      // TODO: link setlist ids to playlist ids in mmkv or neondb
      // if a user has already created a playlist for this setlist, show a button that can take them to the playlist
    },
    onError: (error) => {
      console.error("Tracks mutation failed", error);
    },
  });

  const updatePlaylistImageMutation = useMutation({
    mutationFn: (body: UpdatePlaylistImageRequestBody) =>
      addPlaylistCoverImage(session?.accessToken, {
        playlistId: body.playlistId,
        base64: body.base64,
      }),
    onSuccess: (_, body) => {
      console.log("Playlist image updated!");
    },
    onError: (error) => {
      console.error("Image mutation failed", error);
    },
  });

  useEffect(() => {
    if (setlist) {
      setName(createPlaylistName(setlist));
      setDescription(
        `${setlist?.venue.name} / ${setlist?.venue.city.name} / ${moment(setlist?.eventDate, "DD-MM-YYYY").format("MMMM D, YYYY")}`,
      );
    }
  }, [setlist]);

  const handleCreatePlaylist = async (image?: ImagePickerAsset | null) => {
    try {
      if (!user) throw new Error("User must be logged in");
      if (image) setImage(image);
      if (!spotifyTracks || spotifyTracks.length === 0) return;

      await createPlaylistMutation.mutateAsync({
        name: createPlaylistName(setlist),
        description: description ?? "",
        public: false,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdatePlaylist = async (playlist: Playlist) => {
    try {
      if (!spotifyTracks) return;

      await updatePlaylistTracksMutation.mutateAsync({
        playlistId: playlist.id,
        uris: spotifyTracks.filter((t) => t !== undefined).map((t) => t.uri),
        expected: songs?.length ?? 0,
        found: spotifyTracks.length,
      });

      await addToDatabase({ playlistId: playlist.id, playlistName: playlist.name, setlistId });

      if (image) {
        await updatePlaylistImageMutation.mutateAsync({
          playlistId: playlist.id,
          base64: image.base64,
        });

        storage.set(`playlist-${playlist.id}-image`, image.uri);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openWebPage = async () => {
    try {
      if (playlist) await openBrowserAsync(playlist.external_urls.spotify);
    } catch (error) {
      console.error(error);
    }
  };

  const mutationsPending =
    createPlaylistMutation.isPending ||
    updatePlaylistTracksMutation.isPending ||
    updatePlaylistImageMutation.isPending;

  const currentOperation = updatePlaylistImageMutation.isPending
    ? "Adding cover image..."
    : updatePlaylistTracksMutation.isPending
      ? "Adding tracks..."
      : createPlaylistMutation.isPending
        ? "Creating playlist..."
        : "Please wait...";

  return {
    data: playlist,
    startMutations: handleCreatePlaylist,
    tracksExist: spotifyTracks !== undefined,
    addedTracks,
    tracksFound,
    openWebPage,
    mutationsPending,
    currentOperation,
    name,
    setName,
    description,
    setDescription,
  };
}
