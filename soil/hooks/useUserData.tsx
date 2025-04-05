import { useCallback, useEffect, useMemo, useState } from "react";

// Services
import { getDataKeyValue } from "../services/client-data";
import { onUserDataTypeListChildChanged } from "../services/onUserDataTypeListChildChanged";
import { get } from "../services/firebase";

// Helpers
import { PATHS } from "../services/paths";

// Types
import type { SoilDatabase } from "..";
import type { Data, DataList, StatefulData } from "../services/types";

export type DataListHookProps<T2> = {
  uid: Maybe<string>;
  dataType: T2;
  /** Set this to true if you want to keep all the data up to date at all times. */
  fetchData?: boolean;
  /** Set this to true if you want the data in array form using `dataArray` (`data` will still be populated). */
  includeArray?: boolean;
  /** Set this to true if you want the keys in array form using `keysArray`. */
  includeKeysArray?: boolean;
  /** Turn the realtime data fetching on and off. */
  enabled?: boolean;
  /** If you pass in a `keyValidator` function, it will only fetch data for keys that return true. */
  keyValidator?: (key: string) => boolean;
  onChildChanged?: VoidFunction;
};

export const useUserData = <T2 extends keyof SoilDatabase>({
  uid,
  dataType,
  fetchData = false,
  includeArray = false,
  includeKeysArray = false,
  enabled = true,
  keyValidator,
  onChildChanged,
}: DataListHookProps<T2>) => {
  const [data, setData] = useState<Record<string, StatefulData<T2>>>({});
  const [fetched, setFetched] = useState(false);

  const getData = useCallback(
    (key: string) =>
      getDataKeyValue({ dataType, dataKey: key }).then((val) => setData((prev) => ({ ...prev, [key]: val }))),
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
      onChildChanged?.();
    },
    [fetchData, keyValidator, getData, onChildChanged]
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
    let off: Maybe<VoidFunction>;
    if (uid && enabled) {
      get<Record<T2, DataList[T2]>>(PATHS.userDataTypeList(uid, dataType)).then(async (udl) => {
        if (fetchData) await Promise.all(Object.keys(udl || {}).map(getData));
        else setData(Object.keys(udl || {}).reduce((acc, key) => ({ ...acc, [key]: null }), {} as typeof data));
        setFetched(true);
        off = onUserDataTypeListChildChanged(uid, dataType, childChanged, childRemoved);
      });
    }

    return () => {
      off?.();
      setData({});
    };
  }, [uid, childChanged, childRemoved, dataType, enabled, getData, fetchData]);

  /** Array form of data. This is only populated if `includeArray` is set to true. */
  const dataArray = useMemo(
    () =>
      includeArray
        ? (Object.entries(data || {})
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

  return { fetched, data, dataArray, keysArray, getData, getDataOrCache };
};
