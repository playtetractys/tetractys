import { TETRACTYS_INPUT_ID } from "./constants";
import type { Tetractys } from "@/services/types";

export function handleTetractysInputFocus() {
  const el = document.getElementById(TETRACTYS_INPUT_ID) as HTMLTextAreaElement;
  el?.focus();
}

export function getTetractysMessages(tetractys: Tetractys) {
  const tMessages: [string, string][] = [];

  // Add past Q&As from points in order
  if (tetractys?.points) {
    const orderedPoints = [
      tetractys.points.one,
      tetractys.points.two,
      tetractys.points.three,
      tetractys.points.four,
      tetractys.points.five,
      tetractys.points.six,
      tetractys.points.seven,
      tetractys.points.eight,
      tetractys.points.nine,
      tetractys.points.ten,
    ].filter((point): point is NonNullable<typeof point> => point !== undefined);

    orderedPoints.forEach((point) => {
      if (point.question && point.answer) {
        tMessages.push(["system", point.question], ["user", point.answer]);
      }
    });
  }

  if (tetractys?.result) {
    tMessages.push(["system", tetractys.result]);
  }

  return tMessages;
}
