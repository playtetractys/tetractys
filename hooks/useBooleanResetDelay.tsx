import { useEffect } from "react";

// Helpers
import { seconds } from "@/utils/time";
import { useToggle } from "./useToggle";

/**
 * When the function is called, the boolean is flipped to true for the duration given in seconds.
 * @param duration The duration in seconds - defaults to 1.5.
 * @return An array: a boolean set to false and a function to set it to true.
 */
export const useBooleanResetDelay = (duration: number = 1.5) => {
  let timeout: NodeJS.Timeout;

  const { value: bool, setTrue, setFalse } = useToggle(false);

  const reset = () => {
    timeout = setTimeout(setFalse, seconds(duration).ms);
  };

  useEffect(() => {
    if (bool) reset();

    return () => clearTimeout(timeout);
  }, [bool]); // eslint-disable-line react-hooks/exhaustive-deps

  return [bool, setTrue] as [boolean, VoidFunction];
};
