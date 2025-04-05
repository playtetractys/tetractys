import { useEffect } from "react";

import { useToggle } from "./useToggle";

export const useSsrLoaded = () => {
  const { value: ssrLoaded, setTrue: setSsrLoadedTrue } = useToggle(false);

  useEffect(() => {
    setSsrLoadedTrue();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return ssrLoaded;
};
