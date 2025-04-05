// eslint-disable-next-line no-use-before-define
import React, { createContext, useContext, useEffect } from "react";

// Services
import { useSoilContext } from ".";

// Helpers
import { usePublicData } from "../hooks/usePublicData";

// Types
import type { ReactNode } from "react";
import { useToggle } from "@/hooks/useToggle";
import { Data, StatefulData } from "../services/types";
import type { SoilDatabase } from "..";

type BasePublicDataContext<T2 extends keyof SoilDatabase> = {
  data: Record<string, StatefulData<T2>>;
  dataArray: Mandate<Data<T2>, "key">[];
  turnDataOn: VoidFunction;
};

export const createPublicDataContext = <T2 extends keyof SoilDatabase>(dataType: T2) => {
  const PublicDataContext = createContext<Maybe<BasePublicDataContext<T2>>>(undefined);

  const usePublicDataFromContext = () => {
    const useContextResult = useContext(PublicDataContext);

    if (!useContextResult) throw new Error(`You must wrap your component in an instance of the ${dataType} context`);

    const { data, dataArray, turnDataOn } = useContextResult;

    useEffect(() => {
      turnDataOn();
    }, [turnDataOn]);

    return { data, dataArray };
  };

  const PublicDataContextProviderComponent = ({ children }: { children: ReactNode }) => {
    const { initiallyLoading } = useSoilContext();
    const [practiceDataOn, _, turnDataOn] = useToggle(true);

    const { data, dataArray } = usePublicData<T2>({
      dataType,
      fetchData: true,
      includeArray: true,
      enabled: !initiallyLoading && practiceDataOn,
    });

    const ctx = {
      data,
      dataArray,
      turnDataOn,
    };

    return <PublicDataContext.Provider value={ctx}>{children}</PublicDataContext.Provider>;
  };

  return { usePublicDataFromContext, PublicDataContextProviderComponent };
};
