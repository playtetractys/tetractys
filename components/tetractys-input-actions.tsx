"use client";

import { useTetractysContext } from "@/contexts/tetractysContext";
import { NUMBER_MAP } from "@/services/constants";
import { handleTetractysInputFocus } from "@/services/tetractys";
import { TetractysPoints } from "@/services/types";
import { useSoilContext } from "@/soil/context";
import { useCallback } from "react";
import { toast } from "react-toastify";
import { Spinner } from "./spinner";

export function TetractysInputActions({
  currentPoint,
  setCurrentPoint,
  setQuestion,
  setAnswer,
  setQuote,
  setQuoteAuthor,
  loadingSuggestion,
}: {
  currentPoint: keyof TetractysPoints | null;
  setCurrentPoint: (point: keyof TetractysPoints) => void;
  setQuestion: (question: string) => void;
  setAnswer: (answer: string) => void;
  setQuote: (quote: string) => void;
  setQuoteAuthor: (quoteAuthor: string) => void;
  loadingSuggestion: boolean;
}) {
  const { tetractys } = useSoilContext();
  const { createSuggestedAnswer, currentQandA, tetractysPoint } = useTetractysContext();

  const handleBack = useCallback(() => {
    if (!tetractys?.points) return toast.error("Tetractys points not found");
    if (!currentPoint) return toast.error("Current point not found");

    const currentNumber = NUMBER_MAP[currentPoint];
    if (currentNumber <= 1) return toast.error("Current point number not found");

    const previousPoint = Object.entries(NUMBER_MAP).find(
      ([, num]) => num === currentNumber - 1
    )?.[0] as keyof TetractysPoints;
    if (!previousPoint) return toast.error("Previous point not found");
    const previousPointData = tetractys.points[previousPoint];
    if (!previousPointData) return toast.error("Previous point data not found");

    // Set the answer to the previous point's answer
    setCurrentPoint(previousPoint);
    setQuestion(previousPointData.question);
    setQuote(previousPointData.quote);
    setQuoteAuthor(previousPointData.quoteAuthor);

    const previousAnswer = previousPointData.answer;
    if (previousAnswer) setAnswer(previousAnswer);
  }, [tetractys, currentPoint, setCurrentPoint, setQuestion, setAnswer, setQuote, setQuoteAuthor]);

  const handleNext = useCallback(() => {
    if (!tetractys?.points) return toast.error("Tetractys points not found");
    if (!currentPoint) return toast.error("Tetractys point not found");

    const currentNumber = NUMBER_MAP[currentPoint];
    if (currentNumber <= 0) return toast.error("Current point number not found");

    const nextPoint = Object.entries(NUMBER_MAP).find(
      ([, num]) => num === currentNumber + 1
    )?.[0] as keyof TetractysPoints;
    if (!nextPoint) return toast.error("Next point not found");

    if (nextPoint === tetractysPoint) {
      if (currentQandA) {
        setCurrentPoint(nextPoint);
        setQuestion(currentQandA.question);
        setQuote(currentQandA.quote);
        setQuoteAuthor(currentQandA.quoteAuthor);
        setAnswer(currentQandA.answer ?? "");
        setTimeout(handleTetractysInputFocus);
      } else {
        toast.error("Current Q&A not found");
      }
    } else {
      const nextPointData = tetractys.points[nextPoint];
      if (!nextPointData) return toast.error("Next point data not found");

      // Set the answer to the previous point's answer
      setCurrentPoint(nextPoint);
      setQuestion(nextPointData.question);
      setQuote(nextPointData.quote);
      setQuoteAuthor(nextPointData.quoteAuthor);
      const nextAnswer = nextPointData.answer;
      if (nextAnswer) setAnswer(nextAnswer);
    }
  }, [
    tetractys,
    currentPoint,
    tetractysPoint,
    currentQandA,
    setCurrentPoint,
    setQuestion,
    setAnswer,
    setQuote,
    setQuoteAuthor,
  ]);

  if (!tetractysPoint || tetractysPoint === "one") return null;

  return (
    <div className="flex gap-4 justify-between">
      {currentPoint === "one" ? (
        <div />
      ) : (
        <button
          type="button"
          onClick={handleBack}
          className="btn-ghost-light uppercase font-semibold flex items-center justify-center gap-2"
          disabled={
            !tetractys?.points ||
            Object.entries(tetractys.points)
              .sort(([a], [b]) => NUMBER_MAP[a as keyof typeof NUMBER_MAP] - NUMBER_MAP[b as keyof typeof NUMBER_MAP])
              .find(([, point]) => point.answer == null)?.[0] === "one"
          }
        >
          Previous
        </button>
      )}

      {currentPoint !== tetractysPoint ? (
        <button
          type="button"
          onClick={handleNext}
          className="btn-ghost-light uppercase font-semibold flex items-center justify-center gap-2"
          disabled={
            !tetractys?.points ||
            Object.entries(tetractys.points)
              .sort(([a], [b]) => NUMBER_MAP[a as keyof typeof NUMBER_MAP] - NUMBER_MAP[b as keyof typeof NUMBER_MAP])
              .find(([, point]) => point.answer == null)?.[0] === "one"
          }
        >
          Next
        </button>
      ) : (
        <button
          type="button"
          onClick={createSuggestedAnswer}
          className="btn-ghost-light uppercase font-semibold flex items-center justify-center gap-2"
          disabled={loadingSuggestion}
        >
          {loadingSuggestion && <Spinner />} Suggest Answer
        </button>
      )}
    </div>
  );
}
