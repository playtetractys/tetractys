import { VERCEL_TIMEOUT_BUFFER } from "./constants";

export const preventTimeout = (timeoutMs: number = VERCEL_TIMEOUT_BUFFER) => {
  const start = Date.now();
  const end = start + timeoutMs;

  const timeLeft = () => {
    const now = Date.now();

    return end < now ? 0 : end - now;
  };

  return timeLeft;
};
