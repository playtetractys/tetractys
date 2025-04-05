import { useEffect, useRef } from "react";

export const usePrevious = <T extends unknown>(value: T) => {
  const ref = useRef<Nullable<T>>(null);

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};
