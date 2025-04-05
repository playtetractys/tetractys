import { useCallback, useEffect, useMemo, useState } from "react";
import type { SoilDatabase } from "..";
import { getDataKeyValue } from "../services/client-data";
import { onConnectionDataListChildChanged } from "../services/onConnectionDataListChildChanged";
import { onUserDataListChildChanged } from "../services/onUserDataListChildChanged";
import type { DataList, StatefulData } from "../services/types";

type Props<T2 extends keyof SoilDatabase> = {
  uid: Maybe<string>;
  dataType: Maybe<T2>;
  dataKey: Maybe<string>;
};

type DataState<T2 extends keyof SoilDatabase> = Record<string, Record<string, StatefulData<T2>>>;

export const useUserListAndData = <T2 extends keyof SoilDatabase>({ uid, dataType, dataKey }: Props<T2>) => {
  const [data, setData] = useState<DataState<T2>>({});
  const [dataList, setDataList] = useState<Partial<DataList>>({});
  const [toGetList, setToGetList] = useState<Partial<DataList>>();

  const dataTypeList = useMemo(() => (dataType ? dataList[dataType] : undefined), [dataList, dataType]);
  const dataTypeData = useMemo(() => (dataType ? data[dataType] : undefined), [data, dataType]);
  const dataKeyData = useMemo(
    () => (dataType && dataKey ? data[dataType]?.[dataKey] : undefined),
    [data, dataKey, dataType]
  );

  const getData = useCallback((dType: T2, dKey: string) => {
    getDataKeyValue({ dataType: dType, dataKey: dKey }).then((val) =>
      setData((prev) => ({ ...prev, [dType]: { ...prev[dType], [dKey]: val } }))
    );
  }, []);

  const getDataOrCache = useCallback(
    async (dType: T2, dKey: string) => data[dType]?.[dKey] ?? getData(dType, dKey),
    [data, getData]
  );

  const userDataTypeListChanged = useCallback((dTypeList: DataList[T2], dType: T2) => {
    setDataList((prev) => ({ ...prev, [dType]: dTypeList }));
  }, []);

  const userDataTypeListRemoved = useCallback((dType: T2) => {
    setDataList((prev) =>
      Object.entries(prev).reduce((prv, [dt, dKeys]) => (dType !== dt ? { ...prv, [dt]: dKeys } : prv), {})
    );
    setData((prev) =>
      Object.entries(prev).reduce((prv, [dt, dKeys]) => (dType !== dt ? { ...prv, [dt]: dKeys } : prv), {})
    );
  }, []);

  useEffect(() => {
    if (dataType && dataKey) {
      getDataOrCache(dataType, dataKey);
    }
  }, [dataType, dataKey, getDataOrCache]);

  useEffect(() => {
    if (uid) {
      const off = onUserDataListChildChanged(uid, userDataTypeListChanged, userDataTypeListRemoved);

      return () => {
        off();
        setData({});
        setDataList({});
      };
    }

    return undefined;
  }, [uid, userDataTypeListChanged, userDataTypeListRemoved]);

  const toGetListChanged = useCallback((dTypeList: DataList, dKey: string) => {
    setToGetList((prev) => ({ ...prev, [dKey]: dTypeList }));
  }, []);

  const toGetListRemoved = useCallback(
    (dType: string) =>
      setToGetList((prev) =>
        prev
          ? Object.entries(prev).reduce((prv, [dt, dKeys]) => (dType !== dt ? { ...prv, [dt]: dKeys } : prv), {})
          : prev
      ),
    []
  );

  useEffect(() => {
    if (dataType && dataKey) {
      const off = onConnectionDataListChildChanged(dataType, dataKey, toGetListChanged, toGetListRemoved);

      return () => {
        off();
        setToGetList(undefined);
      };
    }

    return undefined;
  }, [dataType, dataKey, toGetListChanged, toGetListRemoved]);

  return useMemo(
    () => ({ data, dataList, dataTypeList, dataTypeData, dataKeyData, toGetList, getData, getDataOrCache }),
    [data, dataList, dataTypeList, dataTypeData, dataKeyData, toGetList, getData, getDataOrCache]
  );
};
