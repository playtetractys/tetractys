"use client";

import { useEffect, useState, useCallback, useMemo } from "react";

// Services
import { useTetractysContext } from "@/contexts/tetractysContext";

// Heplers
import { handleTetractysInputFocus } from "@/services/tetractys";
import { TETRACTYS_INPUT_ID, TETRACTYS_FORM_ID } from "@/services/constants";

// Components
import TextareaAutosize from "react-textarea-autosize";
import { Spinner } from "@/components/spinner";
import { TetractysInputActions } from "@/components/tetractys-input-actions";

// Types
import type { QandAProps, TetractysPoints } from "@/services/types";

export function TetractysInput({
  currentQandA,
  loading,
  loadingSuggestion,
}: {
  currentQandA?: QandAProps;
  loading: boolean;
  loadingSuggestion: boolean;
}) {
  const { suggestedAnswer, setSuggestedAnswer, tetractysPoint } = useTetractysContext();

  const [question, setQuestion] = useState("");
  const [quote, setQuote] = useState("");
  const [quoteAuthor, setQuoteAuthor] = useState("");

  useEffect(() => {
    if (currentQandA) {
      setQuestion(currentQandA.question);
      setQuote(currentQandA.quote);
      setQuoteAuthor(currentQandA.quoteAuthor);
    }
  }, [currentQandA]);

  const [currentPoint, setCurrentPoint] = useState<keyof TetractysPoints | null>(null);
  useEffect(() => {
    if (tetractysPoint) setCurrentPoint(tetractysPoint);
  }, [tetractysPoint]);

  const [answer, setAnswer] = useState("");

  useEffect(() => {
    handleTetractysInputFocus();
    setAnswer("");
  }, [currentQandA?.question]);

  useEffect(() => {
    if (suggestedAnswer) {
      setSuggestedAnswer("");
      setAnswer(answer ? `${suggestedAnswer}\n\n${answer}` : suggestedAnswer);
    }
  }, [suggestedAnswer, answer, setSuggestedAnswer]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (!currentQandA) return;
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        currentQandA.handler();
      }
    },
    [currentQandA]
  );

  const isPreviousPoint = useMemo(
    () => tetractysPoint && currentPoint !== tetractysPoint,
    [tetractysPoint, currentPoint]
  );

  if (!currentQandA) return null;

  return (
    <>
      <form className="w-full" onSubmit={currentQandA.handler} id={TETRACTYS_FORM_ID}>
        <p className="flex-1 mb-10 text-center text-2xl transition-all">{question}</p>

        <div className="flex-1 w-full flex flex-col gap-4">
          <TextareaAutosize
            id={TETRACTYS_INPUT_ID}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            name="answer"
            tabIndex={0}
            placeholder={currentQandA.placeholder}
            className={`w-full text-${currentQandA.size} input`}
            disabled={loading || loadingSuggestion || isPreviousPoint}
          />

          {!isPreviousPoint && (
            <button type="submit" className="btn flex items-center justify-center gap-2" disabled={loading}>
              {loading && <Spinner />} {currentQandA.btnText}
            </button>
          )}

          <TetractysInputActions
            currentPoint={currentPoint}
            setCurrentPoint={setCurrentPoint}
            setQuestion={setQuestion}
            setAnswer={setAnswer}
            setQuote={setQuote}
            setQuoteAuthor={setQuoteAuthor}
            loadingSuggestion={loadingSuggestion}
          />
        </div>
      </form>

      <div className="text-center py-10 text-zinc-400">
        <p className="italic text-lg font-serif">&quot;{quote}&quot;</p>
        <p className="text-sm mt-2">— {quoteAuthor}</p>
      </div>
    </>
  );
}
