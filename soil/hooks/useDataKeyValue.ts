import { useEffect, useState } from "react";

// Services
import { onDataKeyValue } from "../services/client-data";

// Types
import type { SoilDatabase } from "..";
import type { Data } from "../services/types";

export const useDataKeyValue = <T2 extends keyof SoilDatabase>(dataType: T2, dataKey: Maybe<Nullable<string>>) => {
  const [data, setData] = useState<Nullable<Data<T2>>>();

  useEffect(() => {
    if (dataKey) {
      const off = onDataKeyValue({ dataType, dataKey, cb: setData });

      return () => {
        off();
        setData(undefined);
      };
    }

    return undefined;
  }, [dataType, dataKey]);

  return data;
};
