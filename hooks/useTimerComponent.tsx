import { useCallback, useEffect, useMemo, useState } from "react";

export function useTimerComponent() {
  const [timer, setTimer] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const toggleTimer = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      setStartTime(Date.now());
      setIsRunning(true);
    }
  }, [isRunning]);

  const component = useMemo(
    () => (
      <div className="flex flex-col gap-1 justify-center items-center">
        <div className="text-2xl font-bold text-center">
          {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
        </div>
        <button onClick={toggleTimer} className="btn-ghost btn-sm">
          {isRunning ? "Stop Timer" : "Start Timer"}
        </button>
      </div>
    ),
    [timer, isRunning, toggleTimer]
  );

  return { component, startTime, isRunning, toggleTimer };
}
