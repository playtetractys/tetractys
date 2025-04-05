import { useEffect, useState } from "react";

// Constants
import { onDataKeyValue } from "@/soil/services/client-data";

// Types
import type { SoilDatabase } from "@/soil";
import type { StatefulData } from "@/soil/services/types";

export const useDataKeyValueWithState = <T2 extends keyof SoilDatabase, T3>(
  dataType: T2,
  dataKey: Maybe<Nullable<string>>
) => {
  const [data, setData] = useState<StatefulData<T2>>();

  useEffect(() => {
    if (dataKey) {
      const off = onDataKeyValue({ dataType, dataKey, cb: setData });

      return off;
    }
  }, [dataType, dataKey]);

  return [data, setData] as const;
};
