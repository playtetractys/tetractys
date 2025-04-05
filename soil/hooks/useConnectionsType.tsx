"use client";
import { useEffect, useState } from "react";

// Services
import { onValue } from "../services/firebase";
import { DataListHookProps } from "./useUserData";

// Helpers
import { PATHS } from "../services/paths";

// Types
import type { SoilDatabase } from "..";

/** Returns connections to a particular parent key */
export const useConnectionsType = <T2 extends keyof SoilDatabase, T3 extends keyof SoilDatabase>({
  parentType,
  parentKey,
  dataType,
  enabled = true,
}: Pick<DataListHookProps<T2>, "dataType" | "enabled"> & {
  parentType: T3;
  parentKey: Maybe<string>;
}) => {
  const [connections, setConnections] = useState<Nullable<Record<string, number>>>();

  useEffect(() => {
    if (parentKey && enabled) {
      const offs = onValue(PATHS.connectionDataListConnectionType(parentType, parentKey, dataType), setConnections);

      return () => {
        offs();
        setConnections(undefined);
      };
    }

    return undefined;
  }, [parentType, parentKey, dataType, enabled]);

  return connections;
};
