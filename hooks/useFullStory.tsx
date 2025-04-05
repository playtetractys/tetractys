"use client";
import { useEffect } from "react";
import { useSoilContext } from "@/soil/context/index";
import {
  FullStory,
  init as initFullstory,
  isInitialized,
} from "@fullstory/browser";
import { isProd } from "@/utils/isProd";

export function useFullStory() {
  const { user, initiallyLoading } = useSoilContext();

  useEffect(() => {
    if (!isProd()) return;
    if (initiallyLoading) return;

    if (!isInitialized()) initFullstory({ orgId: "o-22GFM3-na1" });

    if (user?.uid && user?.email) {
      FullStory("setIdentity", {
        uid: user.uid,
        properties: { email: user.email },
      });
    }
  }, [user, initiallyLoading]);
}
