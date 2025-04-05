import { useEffect, useState } from "react";

// Constants
import { getDataKeyValue } from "../services/client-data";

// Types
import type { SoilDatabase } from "..";
import type { StatefulData } from "../services/types";

export const useGetDataKey = <T2 extends keyof SoilDatabase>(dataType: T2, dataKey: Maybe<Nullable<string>>) => {
  const [data, setData] = useState<StatefulData<T2>>();

  useEffect(() => {
    if (dataKey) {
      getDataKeyValue<T2>({ dataType, dataKey }).then(setData);
    }
  }, [dataType, dataKey]);

  return data;
};
