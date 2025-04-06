import { TETRACTYS_INPUT_ID, INITIAL_QUESTION } from "./constants";
import type { Tetractys } from "@/services/types";

export function handleTetractysInputFocus() {
  const el = document.getElementById(TETRACTYS_INPUT_ID) as HTMLTextAreaElement;
  el?.focus();
}

export function getTetractysMessages(tetractys: Tetractys) {
  const tMessages: [string, string][] = [];

  // Add past Q&As from points in order
  const orderedPoints = [
    tetractys.overallStrategy,
    tetractys.militaryStrategy,
    tetractys.economicStrategy,
    tetractys.diplomaticStrategy,
    tetractys.explorationStrategy,
    tetractys.researchStrategy,
    tetractys.developmentStrategy,
    tetractys.eight,
    tetractys.nine,
    tetractys.ten,
  ].filter((point): point is NonNullable<typeof point> => point !== undefined);

  orderedPoints.forEach((point) => {
    tMessages.push(["system", point.prompt]);
  });

  tMessages.push(["system", INITIAL_QUESTION.question]);

  return tMessages;
}
