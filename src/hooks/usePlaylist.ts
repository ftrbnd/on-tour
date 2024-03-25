import { useMutation } from "@tanstack/react-query";
import { ImagePickerAsset } from "expo-image-picker";
import { openBrowserAsync } from "expo-web-browser";
import moment from "moment";
import { useState } from "react";

import useSetlist from "./useSetlist";
import { useAuth } from "../providers/AuthProvider";
import {
  CreatePlaylistRequestBody,
  createPlaylist,
  UpdatePlaylistRequestBody,
  addSongsToPlaylist,
  UpdatePlaylistImageRequestBody,
  addPlaylistCoverImage,
  getUriFromSetlistFmSong,
} from "../services/spotify";
import { createPlaylistName } from "../utils/helpers";
import { Song } from "../utils/setlist-fm-types";
import { Playlist, TrackItem } from "../utils/spotify-types";

export default function usePlaylist(setlistId: string) {
  const { data: setlist, primary, encore } = useSetlist(setlistId);
  const { session, user } = useAuth();

  const [playlist, setPlaylist] = useState<Playlist<TrackItem> | null>(null);
  const [name, setName] = useState<string | null>(createPlaylistName(setlist) ?? null);
  const [description, setDescription] = useState<string | null>(
    `${setlist?.venue.name} / ${setlist?.venue.city.name} / ${moment(setlist?.eventDate, "DD-MM-YYYY").format("MMMM D, YYYY")}` ??
      null,
  );
  const [image, setImage] = useState<ImagePickerAsset | null>(null);

  const [addedTracks, setAddedTracks] = useState<boolean>(false);
  const [tracksFound, setTracksFound] = useState<number | null>(null);

  const createPlaylistMutation = useMutation({
    mutationFn: (body: CreatePlaylistRequestBody) =>
      createPlaylist(session?.accessToken, user?.providerId, body),
    onSuccess: async (playlist) => {
      console.log("Playlist created!");
      setPlaylist(playlist);
      await handleUpdatePlaylistTracks(playlist);
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

      if (image) handleUpdatePlaylistImage(image);

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

  const handleCreatePlaylist = async (image?: ImagePickerAsset | null) => {
    try {
      if (!user) throw new Error("User must be logged in");
      if (image) setImage(image);

      await createPlaylistMutation.mutateAsync({
        name: createPlaylistName(setlist),
        description: description ?? "",
        public: false,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdatePlaylistTracks = async (playlist: Playlist) => {
    try {
      const p = primary?.song ?? [];
      const e = encore?.song ?? [];
      const allSongs = [...p, ...e];

      const uris: string[] = [];

      for (const song of allSongs) {
        const uri = await getSpotifyUri(song);
        if (!uri) continue;

        uris.push(uri);
      }

      await updatePlaylistTracksMutation.mutateAsync({
        playlistId: playlist.id,
        uris,
        expected: allSongs.length,
        found: uris.length,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdatePlaylistImage = async (selectedImage: ImagePickerAsset) => {
    try {
      if (!playlist) return;

      await updatePlaylistImageMutation.mutateAsync({
        playlistId: playlist.id,
        base64: selectedImage.base64,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getSpotifyUri = async (song: Song) => {
    try {
      const artistToSearch = song.cover ? song.cover.name : setlist?.artist.name;

      const uri = await getUriFromSetlistFmSong(session?.accessToken, artistToSearch, song);

      return uri;
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
