import { useCallback, useEffect, useMemo, useState } from "react";

export const useTimer = (startTimeInMinutes: number) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentSeconds, setCurrentSeconds] = useState<number>(startTimeInMinutes * 60);
  const [minutes, seconds] = useMemo(() => [Math.floor(currentSeconds / 60), currentSeconds % 60], [currentSeconds]);

  const handleStart = useCallback(() => setIsRunning(true), []);
  const handleStop = useCallback(() => setIsRunning(false), []);
  const handleReset = useCallback(() => {
    setIsRunning(false);
    setCurrentSeconds(startTimeInMinutes * 60);
  }, [startTimeInMinutes]);

  useEffect(() => {
    if (isRunning) {
      const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === "5") {
          setCurrentSeconds(5);
        }
      };
      window.addEventListener("keypress", handleKeyPress);

      const intervalId = setInterval(() => {
        setCurrentSeconds((prevTotalSeconds) => {
          if (prevTotalSeconds === 0) {
            clearInterval(intervalId);
            return 0;
          }

          return prevTotalSeconds - 1;
        });
      }, 1000);

      return () => {
        clearInterval(intervalId);
        window.removeEventListener("keypress", handleKeyPress);
      };
    }
    return undefined;
    // Cleanup function to clear the interval when the component unmounts or when the timer is stopped
  }, [isRunning]);

  return { minutes, seconds, isRunning, handleReset, handleStart, handleStop };
};
