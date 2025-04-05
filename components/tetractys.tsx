"use client";

// Services
import { useSoilContext } from "@/soil/context";
import { useTetractysContext } from "@/contexts/tetractysContext";

// Components
import { TetractysInput } from "@/components/tetractys-input";
import { TetractysComplete } from "@/components/tetractys-complete";
import { useAnimatedTransitionClasses } from "@/hooks/useAnimatedTransitionClasses";
import { useMemo } from "react";

export function Tetractys() {
  const { tetractys } = useSoilContext();
  const { currentQandA, loading, loadingSuggestion } = useTetractysContext();

  const data = useMemo(() => ({ tetractys, currentQandA }), [tetractys, currentQandA]);

  const [dataToUse, quoteTransitionClasses] = useAnimatedTransitionClasses(data);

  if (!dataToUse) return null;

  return dataToUse?.tetractys?.result ? (
    <TetractysComplete tetractys={dataToUse.tetractys} />
  ) : (
    <div className={`mt-20 w-full max-w-xl animate__animated ${quoteTransitionClasses}`}>
      <TetractysInput currentQandA={dataToUse?.currentQandA} loading={loading} loadingSuggestion={loadingSuggestion} />
    </div>
  );
}
