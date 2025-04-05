import { useCallback, useEffect, useMemo, useState } from "react";
import type { SoilDatabase } from "..";
import { getDataKeyValue } from "../services/client-data";
import { onPublicDataTypeListChildChanged } from "../services/onPublicDataTypeListChildChanged";

// Types
import type { Data, StatefulData } from "../services/types";
import type { DataListHookProps } from "./useUserData";

export const usePublicData = <T2 extends keyof SoilDatabase>({
  dataType,
  fetchData = false,
  includeArray = false,
  includeKeysArray = false,
  enabled = true,
  keyValidator,
}: Omit<DataListHookProps<T2>, "uid">) => {
  const [data, setData] = useState<Record<string, StatefulData<T2>>>({});

  const getData = useCallback(
    (key: string) =>
      getDataKeyValue<T2>({ dataType, dataKey: key }).then((val) => setData((prev) => ({ ...prev, [key]: val }))),
    [dataType]
  );

  const getDataOrCache = useCallback(async (key: string) => data[key] || getData(key), [data, getData]);

  const childChanged = useCallback(
    (_: number, key: string) => {
      if (!fetchData || (keyValidator && !keyValidator(key))) {
        setData((prev) => ({ ...prev, [key]: null }));
      } else {
        getData(key);
      }
    },
    [fetchData, keyValidator, getData]
  );

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
      const off = onPublicDataTypeListChildChanged(dataType, childChanged, childRemoved);

      return () => {
        off();
        setData({});
      };
    }

    return undefined;
  }, [childChanged, childRemoved, dataType, enabled]);

  /** Array form of data. This is only populated if `includeArray` is set to true. */
  const dataArray = useMemo(
    () =>
      includeArray
        ? (Object.entries(data)
            .filter(([_, d]) => Boolean(d))
            .map(([key, d]) => ({
              ...d,
              key,
            })) as Mandate<Data<T2>, "key">[])
        : [],
    [data, includeArray]
  );

  /** Array of keys. This is only populated if `includeKeysArray` is set to true. */
  const keysArray = useMemo(() => (includeKeysArray ? Object.keys(data) : []), [data, includeKeysArray]);

  return useMemo(
    () => ({ data, dataArray, keysArray, getData, getDataOrCache }),
    [data, dataArray, keysArray, getData, getDataOrCache]
  );
};
