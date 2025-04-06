import { getToken } from "@/soil/services/auth";
import { Tetractys, CreditsRequest, QandA } from "./types";
import { getTetractysMessages } from "./tetractys";

async function authFetch(url: string, options: RequestInit) {
  const token = await getToken();
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers, Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error(response.statusText);

  return response.json();
}

export async function createPoint(tetractysKey: string, tetractys: Tetractys) {
  if (!tetractysKey) throw new Error("Tetractys key is required to create a strategy points");

  const data = await authFetch(`/api/strategy/point?tetractysKey=${tetractysKey}`, {
    method: "POST",
    body: JSON.stringify(getTetractysMessages(tetractys)),
  });

  return data as QandA;
}

export async function suggestAnswer(tetractysKey: string, tetractys: Tetractys, question: string) {
  if (!tetractysKey) throw new Error("Tetractys key is required to suggest an answer");

  const data = await authFetch(`/api/strategy/point/answer?tetractysKey=${tetractysKey}`, {
    method: "POST",
    body: JSON.stringify([...getTetractysMessages(tetractys), ["system", question]]),
  });

  return data.answer as string;
}

export async function createResult(tetractysKey: string, tetractys: Tetractys) {
  if (!tetractysKey) throw new Error("Tetractys key is required to create a strategy result");

  const data = await authFetch(`/api/strategy/result?tetractysKey=${tetractysKey}`, {
    method: "POST",
    body: JSON.stringify(getTetractysMessages(tetractys)),
  });

  return data.result as string;
}

export async function getCreditSessionUrl(amount: number, redirectPathname: string) {
  const data = await authFetch("/api/stripe/credits", {
    method: "POST",
    body: JSON.stringify({ amount, redirectPathname } as CreditsRequest),
  });

  window.location.href = data.url;
}

export function getInitialCredits() {
  return authFetch("/api/stripe/credits/initial", { method: "GET" });
}
