"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from "react";

// Services
import { useSoilContext } from "@/soil/context";
import { pushKey } from "@/soil/services/firebase";
import { suggestAnswer } from "@/services/api";

// Helpers
import { INITIAL_QUESTION, TETRACTYS_FORM_ID } from "@/services/constants";
import { handleTetractysInputFocus } from "@/services/tetractys";

// Types
import type { QandAProps } from "@/services/types";

type BaseTetractysContext = {
  currentQandA: QandAProps | undefined;
  suggestedAnswer: string;
  setSuggestedAnswer: (suggestedAnswer: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  loadingSuggestion: boolean;
  setLoadingSuggestion: (loadingSuggestion: boolean) => void;
  createSuggestedAnswer: () => Promise<void>;
};

const TetractysContext = createContext<Maybe<BaseTetractysContext>>(undefined);

export const useTetractysContext = () => {
  const useContextResult = useContext(TetractysContext);

  if (!useContextResult) {
    throw new Error("You must wrap your component in an instance of TetractysContextProviderComponent");
  }

  return useContextResult;
};

export const TetractysContextProviderComponent = ({ children }: PropsWithChildren) => {
  const { user, tetractysKey, tetractys } = useSoilContext();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  const [suggestedAnswer, setSuggestedAnswer] = useState("");

  const handleFormSubmit = useCallback(
    (handler: (answer: string) => Promise<void>) => (e?: React.FormEvent<HTMLFormElement>) => {
      let answer = "";
      if (e) {
        e.preventDefault();
        answer = (e.target as HTMLFormElement).answer.value;
      } else {
        answer = (document.getElementById(TETRACTYS_FORM_ID) as HTMLFormElement)?.answer.value ?? "";
      }
      return handler(answer);
    },
    []
  );

  const handleCreateTetractys = useCallback(
    handleFormSubmit(async (answer) => {
      if (!user) throw new Error("User not found");

      try {
        setLoading(true);

        const dataKey = pushKey("tetractys");

        // await createData({
        //   dataType: "tetractys",
        //   dataKey,
        //   data: {},
        //   owners: [user?.uid],
        // });

        // const newTetractys: Mandate<Tetractys, "points"> = { points: { one: { ...INITIAL_QUESTION, answer } } };

        // const point = await createPoint(dataKey, newTetractys);

        // newTetractys.points.two = point;

        router.push(`/t/${dataKey}`);
      } catch (error) {
        toast.error("Failed to create tetractys");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }),
    [user, router, setLoading]
  );

  const currentQandA: QandAProps | undefined = useMemo(() => {
    if (!tetractysKey) {
      return {
        ...INITIAL_QUESTION,
        handler: handleCreateTetractys,
        btnText: "Start the process",
      };
    }

    if (!tetractys) return undefined;

    return {
      ...INITIAL_QUESTION,
      handler: handleCreateTetractys,
      btnText: "Submit",
      size: "xl",
    };
  }, [tetractys]);

  const createSuggestedAnswer = useCallback(async () => {
    if (!tetractysKey) throw new Error("Tetractys key not found");
    if (!tetractys) throw new Error("Tetractys not found");
    if (!currentQandA) throw new Error("Current Q and A not found");
    try {
      setLoadingSuggestion(true);
      const suggestedAnswer = await suggestAnswer(tetractysKey, tetractys, currentQandA.question);
      setSuggestedAnswer(suggestedAnswer);
      setTimeout(handleTetractysInputFocus);
    } catch (error) {
      toast.error("Failed to create suggested answer");
      console.error(error);
    } finally {
      setLoadingSuggestion(false);
    }
  }, [currentQandA]);

  const ctx = useMemo(
    () => ({
      currentQandA,
      suggestedAnswer,
      setSuggestedAnswer,
      loading,
      setLoading,
      loadingSuggestion,
      setLoadingSuggestion,
      createSuggestedAnswer,
    }),
    [
      currentQandA,
      suggestedAnswer,
      setSuggestedAnswer,
      loading,
      setLoading,
      loadingSuggestion,
      setLoadingSuggestion,
      createSuggestedAnswer,
    ]
  );

  return <TetractysContext.Provider value={ctx}>{children}</TetractysContext.Provider>;
};
