import { useCallback, useEffect, useMemo, useState } from "react";

// Services
import { onDataTypeChildChanged } from "../services/onDataTypeChildChanged";

// Types
import type { SoilDatabase } from "..";
import type { Data } from "../services/types";

export const useDataType = <T2 extends keyof SoilDatabase>(dataType: T2, enabled = true) => {
  const [data, setData] = useState<Record<string, Data<T2>>>({});

  const childChanged = useCallback((val: Data<T2>, key: string) => setData((prev) => ({ ...prev, [key]: val })), []);

  const childRemoved = useCallback(
    (key: string) =>
      setData((prev) =>
        Object.entries(prev).reduce(
          (prv, [dataKey, dataVal]) => (dataKey !== key ? { ...prv, [dataKey]: dataVal } : prv),
          {}
        )
      ),
    []
  );

  useEffect(() => {
    if (enabled) {
      const off = onDataTypeChildChanged<T2>(dataType, childChanged, childRemoved);

      return () => {
        off();
        setData({});
      };
    }

    return undefined;
  }, [childChanged, childRemoved, dataType, enabled]);

  return useMemo(() => data, [data]);
};
