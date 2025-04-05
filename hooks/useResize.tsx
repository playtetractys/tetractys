import { useEffect, useRef, useState } from "react";

export const useResize = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ height: ref.current?.clientHeight ?? 0, width: ref.current?.clientWidth ?? 0 });

  const handleResize = () => {
    const height = ref.current?.clientHeight ?? 0;
    const width = ref.current?.clientWidth ?? 0;

    setSize({ height, width });
  };

  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout>;

    const onResizeEnd = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 100);
    };
    handleResize();

    if (ref.current) window.addEventListener("resize", onResizeEnd);

    return () => window.removeEventListener("resize", onResizeEnd);
  }, [ref]);

  return { ref, size };
};
