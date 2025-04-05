import { useEffect, useState } from "react";

export const useSyncedState = <T extends unknown>(val: Maybe<T>, defaultVal: T) => {
  const [state, setState] = useState<T>(val === undefined ? defaultVal : val);

  useEffect(() => {
    if (val) setState(val);
  }, [val]);

  return [state, setState] as const;
};
