import { useCallback, useEffect, useMemo, useState } from "react";

// Services
import { onDataKeyFieldChildChanged } from "../services/onDataKeyFieldChildChanged";
import { get } from "../services/firebase";

// Helpers
import { PATHS } from "../services/paths";

// Types
import type { SoilDatabase } from "..";
import type { Data } from "../services/types";

export type DataListHookProps<T2 extends keyof SoilDatabase, T22 extends keyof Data<T2>> = {
  dataType: T2;
  dataKey?: Maybe<string>;
  field: T22;
  /** Set this to true if you want to keep all the data up to date at all times. */
  includeArray?: boolean;
  /** Turn the realtime data fetching on and off. */
  enabled?: boolean;
};

export const useDataKeyFieldChildChanged = <
  T2 extends keyof SoilDatabase,
  T22 extends keyof Data<T2>,
  T extends Data<T2>[T22] extends object ? Data<T2>[T22] : never
>({
  dataType,
  dataKey,
  field,
  enabled = true,
  includeArray = false,
}: DataListHookProps<T2, T22>) => {
  const [data, setData] = useState<Nullable<T>>();

  const childChanged = useCallback(
    (val: T[keyof T], key: string) => setData((prev) => ({ ...prev, [key]: val } as T)),
    []
  );

  const childRemoved = useCallback(
    (key: string) =>
      setData((prev) =>
        Object.entries(prev || {}).reduce(
          (prv, [dataKey, dataVal]) => (dataKey !== key ? { ...prv, [dataKey]: dataVal } : prv),
          {} as T
        )
      ),
    []
  );

  useEffect(() => {
    let off: Maybe<VoidFunction>;
    if (dataKey && enabled) {
      get<T>(PATHS.dataKeyField(dataType, dataKey, field)).then(async (val) => {
        setData(val);
        off = onDataKeyFieldChildChanged(dataType, dataKey, field, childChanged, childRemoved);
      });
    }

    return () => {
      off?.();
      setData({} as T);
    };
  }, [dataKey, field, childChanged, childRemoved, dataType, enabled]);

  const dataArray = useMemo(
    () =>
      includeArray && data
        ? Object.entries(data)
            .filter(([_, d]) => Boolean(d))
            .map(([key, val]) => ({ ...val, key } as ValueOf<T> & { key: string }))
        : [],
    [includeArray, data]
  );

  return { data, dataArray };
};
