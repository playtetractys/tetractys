import { useEffect, useState } from "react";
import type { SoilDatabase } from "..";

// Constants
import { onDataKeyFieldValue } from "../services/client-data";
import { Data } from "../services/types";

export const useDataKeyFieldValue = <T2 extends keyof SoilDatabase, T22 extends keyof Data<T2>>(
  dataType: T2,
  dataKey: Maybe<Nullable<string>>,
  field: T22
) => {
  const [data, setData] = useState<Nullable<Data<T2>[T22]>>();

  useEffect(() => {
    if (dataKey) {
      const off = onDataKeyFieldValue({ dataType, dataKey, field, cb: setData });

      return off;
    }

    return undefined;
  }, [dataType, dataKey, field]);

  return data;
};
