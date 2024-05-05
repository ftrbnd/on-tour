import { useMutation } from "@tanstack/react-query";
import * as FileSystem from "expo-file-system";
import { ImagePickerAsset } from "expo-image-picker";
import { openBrowserAsync } from "expo-web-browser";
import moment from "moment";
import { useEffect, useState } from "react";
import { useToast } from "react-native-toast-notifications";

import useCreatedPlaylists from "./useCreatedPlaylists";
import useSetlist from "./useSetlist";
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

interface PreSavedImage {
  base64?: string;
  uri?: string;
}

export default function usePlaylist(setlistId: string) {
  const { data: setlist, songs, spotifyTracks } = useSetlist(setlistId);
  const { session, user } = useAuth();
  const toast = useToast();

  const [playlist, setPlaylist] = useState<Playlist<TrackItem> | null>(null);
  const { addToDatabase } = useCreatedPlaylists(playlist?.id);

  const [name, setName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [image, setImage] = useState<ImagePickerAsset | null>(null);
  const [preSavedImage, setPreSavedImage] = useState<PreSavedImage | null>(null);

  const [addedTracks, setAddedTracks] = useState<boolean>(false);
  const [tracksFound, setTracksFound] = useState<number | null>(null);

  const createPlaylistMutation = useMutation({
    mutationFn: (body: CreatePlaylistRequestBody) =>
      createPlaylist(session?.accessToken, user?.providerId, body),
    onError: () => {
      toast.show("Failed to create playlist.", {
        type: "danger",
      });
    },
    onSuccess: async (data) => {
      setPlaylist(data);
      await handleUpdatePlaylist(data);
    },
  });

  const updatePlaylistTracksMutation = useMutation({
    mutationFn: (body: UpdatePlaylistRequestBody) =>
      addSongsToPlaylist(session?.accessToken, { playlistId: body.playlistId, uris: body.uris }),
    onError: () => {
      toast.show("Failed to add tracks to playlist.", {
        type: "danger",
      });
    },
    onSuccess: async (_data, variables) => {
      setTracksFound(variables.found ?? null);
      setAddedTracks(true);
    },
  });

  const updatePlaylistImageMutation = useMutation({
    mutationFn: (body: UpdatePlaylistImageRequestBody) =>
      addPlaylistCoverImage(session?.accessToken, {
        playlistId: body.playlistId,
        base64: body.base64,
      }),
    onError: () => {
      toast.show("Failed to add image to playlist.", {
        type: "danger",
      });
    },
  });

  useEffect(() => {
    if (setlist) {
      setDefaults();
    }
  }, [setlist]);

  const handleCreatePlaylist = async (
    image?: ImagePickerAsset | null,
    preSavedImage?: PreSavedImage | null,
  ) => {
    try {
      if (!user) throw new Error("User must be logged in");
      if (preSavedImage?.uri) {
        const base64 = await FileSystem.readAsStringAsync(preSavedImage.uri, {
          encoding: "base64",
        });

        setPreSavedImage({ uri: preSavedImage.uri, base64 });
      } else if (image) {
        setImage(image);
      }
      if (!spotifyTracks || spotifyTracks.length === 0) return;

      await createPlaylistMutation.mutateAsync({
        name: name ?? "",
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

      await addToDatabase({ id: playlist.id, title: playlist.name, setlistId });

      if (image || preSavedImage) {
        await updatePlaylistImageMutation.mutateAsync({
          playlistId: playlist.id,
          base64: image ? image.base64 : preSavedImage?.base64,
        });

        storage.set(`playlist-${playlist.id}-image`, image ? image.uri : preSavedImage?.uri ?? "");
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

  const setDefaults = () => {
    setName(createPlaylistName(setlist));
    setDescription(
      `${setlist?.venue.name} / ${setlist?.venue.city.name} / ${moment(setlist?.eventDate, "DD-MM-YYYY").format("MMMM D, YYYY")}`,
    );
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
    tracksExist: spotifyTracks !== undefined && spotifyTracks.length > 0,
    addedTracks,
    tracksFound,
    openWebPage,
    mutationsPending,
    currentOperation,
    name,
    setName,
    description,
    setDescription,
    setDefaults,
  };
}
