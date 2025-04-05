import { useEffect, useState } from "react";

// Services
import { onValue } from "../services/firebase";

export const useValue = <T>(path: string | undefined) => {
  const [data, setData] = useState<Nullable<T>>();

  useEffect(() => {
    if (path) {
      const off = onValue(path, setData);

      return () => {
        off();
        setData(undefined);
      };
    }

    return undefined;
  }, [path]);

  return data;
};
