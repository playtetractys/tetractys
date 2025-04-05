"use client";

import { useEffect, useState } from "react";

export function useAnimatedTransitionClasses<T>(
  newValue: T,
  duration = 500,
  entryClass = "animate__zoomIn",
  exitClass = "animate__zoomOut"
) {
  const [animationClass, setAnimationClass] = useState(entryClass);
  const [oldValue, setOldValue] = useState<T>();

  useEffect(() => {
    // Set an exit animation
    if (oldValue) setAnimationClass(exitClass);

    // Wait for the exit animation to complete before updating the count
    setTimeout(() => {
      setOldValue(newValue);
      // Set an entrance animation
      setAnimationClass(entryClass);
    }, duration);
  }, [newValue, entryClass, exitClass, duration]);

  return [oldValue, animationClass] as const;
}
