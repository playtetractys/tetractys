"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from "react";

// Services
import { useSoilContext } from "@/soil/context";
import { pushKey, set, update } from "@/soil/services/firebase";
import { createPoint, createResult, suggestAnswer } from "@/services/api";
import { createData, updateData } from "@/soil/services/client-data";

// Helpers
import { INITIAL_QUESTION, NEXT_POINT_MAP, NUMBER_MAP, TETRACTYS_FORM_ID } from "@/services/constants";
import { PATHS } from "@/soil/services/paths";
import { handleTetractysInputFocus } from "@/services/tetractys";

// Types
import type { TetractysPoints, QandAProps, QandA, Tetractys } from "@/services/types";

type BaseTetractysContext = {
  tetractysPoint: keyof TetractysPoints | undefined;
  currentQandA: QandAProps | undefined;
  completedTetractys: boolean;
  suggestedAnswer: string;
  setSuggestedAnswer: (suggestedAnswer: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  loadingSuggestion: boolean;
  setLoadingSuggestion: (loadingSuggestion: boolean) => void;
  createSuggestedAnswer: () => Promise<void>;
};

async function updatePoint(
  uid: string | undefined,
  tetractysKey: string | undefined,
  tetractysPoint: keyof TetractysPoints | undefined,
  point: Partial<QandA>
) {
  if (!uid) throw new Error("User not found");
  if (!tetractysKey || !tetractysPoint) throw new Error("Tetractys not found");

  await update(PATHS.dataKeyFieldKey("tetractys", tetractysKey, "points", tetractysPoint), point);
  await set(PATHS.userDataKeyList(uid, "tetractys", tetractysKey), Date.now());
}

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

  const tetractysPoint = useMemo(() => {
    if (!tetractys?.points) return undefined;
    return Object.entries(tetractys?.points ?? {})
      .sort(([a], [b]) => NUMBER_MAP[a as keyof typeof NUMBER_MAP] - NUMBER_MAP[b as keyof typeof NUMBER_MAP])
      .find(([, point]) => point.answer == null)?.[0] as keyof TetractysPoints;
  }, [tetractys?.points]);

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

        await createData({
          dataType: "tetractys",
          dataKey,
          data: {},
          owners: [user?.uid],
        });

        const newTetractys: Mandate<Tetractys, "points"> = { points: { one: { ...INITIAL_QUESTION, answer } } };

        const point = await createPoint(dataKey, newTetractys);

        newTetractys.points.two = point;

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

  const handlePointSubmit = useCallback(
    handleFormSubmit(async (answer) => {
      if (!tetractysKey) throw new Error("Tetractys key not found");
      if (!tetractys) throw new Error("Tetractys not found");
      if (!tetractysPoint) throw new Error("Tetractys point not found");
      if (!tetractys.points) throw new Error("Tetractys points not found");
      const currentPoint = tetractys.points[tetractysPoint];
      if (!currentPoint) throw new Error("Tetractys point data not found");
      try {
        setLoading(true);
        await updatePoint(user?.uid, tetractysKey, tetractysPoint, { answer });

        const newTetractys = {
          ...tetractys,
          points: { ...tetractys.points, [tetractysPoint]: { ...currentPoint, answer } },
        };

        const nextPoint = NEXT_POINT_MAP[tetractysPoint];

        if (nextPoint) {
          const point = await createPoint(tetractysKey, newTetractys);
          await updatePoint(user?.uid, tetractysKey, nextPoint, point);
        } else {
          const result = await createResult(tetractysKey, newTetractys);
          await updateData({ dataType: "tetractys", dataKey: tetractysKey, data: { result } });
        }
      } catch (error) {
        toast.error("Failed to submit answer");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }),
    [user?.uid, tetractysKey, tetractysPoint]
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
    if (!tetractys.points) return undefined;

    const pointQandA = tetractys.points[tetractysPoint as keyof TetractysPoints];
    if (!pointQandA) return undefined;

    return {
      ...pointQandA,
      handler: handlePointSubmit,
      btnText: "Submit",
      size: "xl",
    };
  }, [tetractys, tetractysPoint, handlePointSubmit]);

  const completedTetractys = useMemo(() => {
    if (!tetractys || !tetractys.points) return false;
    if (tetractys.result) return true;
    return Object.keys(NUMBER_MAP).every((key) => tetractys.points?.[key as keyof TetractysPoints]?.answer);
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
      tetractysPoint,
      currentQandA,
      completedTetractys,
      suggestedAnswer,
      setSuggestedAnswer,
      loading,
      setLoading,
      loadingSuggestion,
      setLoadingSuggestion,
      createSuggestedAnswer,
    }),
    [
      tetractysPoint,
      currentQandA,
      completedTetractys,
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
