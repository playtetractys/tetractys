import { useEffect } from "react";
import type { Router } from "next/router";

// Services
import { useSoilContext } from "../context";
import { getCurrentUser } from "./auth";
import { onDisconnect, push, pushKey } from "./firebase";
import { isoTrackEvent } from "./data";

// Constants
import { PATHS } from "./paths";

// Types
import type { TrackingData } from "./types";

export const trackEvent = (eventName: string, metadata?: object) =>
  isoTrackEvent(push, eventName, getCurrentUser()?.uid || "unknown", metadata);

export const usePageTracking = (asPath: Router["asPath"], query: Router["query"]) => {
  const { userUid } = useSoilContext();

  useEffect(() => {
    if (userUid) trackEvent("pageView", { path: asPath });
  }, [asPath, userUid]);

  useEffect(() => {
    if (userUid) {
      if (query.source) {
        trackEvent(`source__${query.source}__ad__${query.ad}`);
      }

      trackEvent("onConnect");
      const path = PATHS.trackingKey(getCurrentUser()?.uid ?? "unknown", "onDisconnect");
      onDisconnect<TrackingData>(`${path}/${pushKey(path)}`, {
        createdAt: Date.now(),
        metadata: null,
      });
    }
  }, [userUid]); // eslint-disable-line react-hooks/exhaustive-deps
};
