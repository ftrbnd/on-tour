import { useQuery } from "@tanstack/react-query";
import { openBrowserAsync } from "expo-web-browser";
import { useState, useEffect } from "react";

import { getOneSetlist } from "../services/setlist-fm";
import { BasicSet } from "../utils/setlist-fm-types";

export default function useSetlist(id: string) {
  const [primary, setPrimary] = useState<BasicSet | null>(null);
  const [encore, setEncore] = useState<BasicSet | null>(null);

  const { data: setlist } = useQuery({
    queryKey: ["setlist", id],
    queryFn: () => getOneSetlist(id),
    enabled: id !== null,
  });

  useEffect(() => {
    if (setlist) {
      setPrimary(setlist.sets.set[0]);
      setEncore(setlist.sets.set[1]);
    }
  }, [setlist]);

  const openWebpage = async () => {
    try {
      if (setlist) await openBrowserAsync(setlist.url);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    data: setlist,
    primary,
    encore,
    openWebpage,
  };
}
