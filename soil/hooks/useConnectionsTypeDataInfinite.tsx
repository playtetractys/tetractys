"use client";
import { useCallback, useEffect, useMemo, useState } from "react";

// Services
import { getDataKeyValue } from "../services/client-data";
import { onConnectionsDataListChildChanged } from "../services/onConnectionsDataListChildChanged";
import { DataListHookProps } from "./useUserData";

// Types
import type { SoilDatabase } from "..";
import type { Data } from "../services/types";

/** Returns data connected to a particular parent data key */
export const useConnectionsTypeDataInfinite = <T2 extends keyof SoilDatabase, T3 extends keyof SoilDatabase>({
  parentType,
  parentKey,
  dataType,
  includeArray = false,
  enabled = true,
}: Pick<DataListHookProps<T2>, "dataType" | "includeArray" | "enabled"> & {
  parentType: T3;
  parentKey: Maybe<string>;
}) => {
  const [data, setData] = useState({} as Record<string, Data<T2>>);

  const getData = useCallback(
    (key: string) =>
      getDataKeyValue({ dataType, dataKey: key }).then(
        (val) => val && setData((prev) => ({ ...prev, [key]: { ...val, key } }))
      ),
    [dataType]
  );

  const childChanged = useCallback((_: number, key: string) => getData(key), [getData]);

  const childRemoved = useCallback(
    (key: string) =>
      setData((prev) =>
        Object.entries(prev).reduce((prv, [dKey, dVal]) => (dKey !== key ? { ...prv, [dKey]: dVal } : prv), {})
      ),
    []
  );

  useEffect(() => {
    if (parentKey && enabled) {
      const offs = onConnectionsDataListChildChanged(parentType, parentKey, dataType, childChanged, childRemoved);

      return () => {
        offs();
        setData({});
      };
    }

    return undefined;
  }, [parentType, parentKey, dataType, childChanged, childRemoved, enabled]);

  const dataArray = useMemo(
    () =>
      includeArray
        ? Object.entries(data)
            .filter(([_, d]) => Boolean(d))
            .map(([key, val]) => ({ ...val, key } as unknown as Mandate<Data<T2>, "key">))
        : [],
    [includeArray, data]
  );

  return { data, dataArray };
};
