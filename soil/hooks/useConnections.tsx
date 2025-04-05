import { useEffect, useState } from "react";

// Services
import { onValue } from "../services/firebase";

// Constants
import { PATHS } from "../services/paths";

// Types
import type { SoilDatabase } from "..";

export type TProps = {
  dataType: keyof SoilDatabase;
  dataKey: string;
  /** Turn the realtime data fetching on and off. */
  enabled?: boolean;
};

export const useConnections = ({ dataType, dataKey, enabled = true }: TProps) => {
  const [connections, setConnections] = useState();

  useEffect(() => {
    if (dataType && dataKey && enabled) {
      const off = onValue(PATHS.connectionDataListKey(dataType, dataKey), setConnections);

      return () => {
        off();
        setConnections(undefined);
      };
    }

    return undefined;
  }, [dataType, enabled, dataKey]);

  return connections;
};
