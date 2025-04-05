// eslint-disable-next-line no-use-before-define
import React, { createContext, useContext, useEffect, useMemo } from "react";

// Services
import { useSoilContext } from ".";

// Helpers
import { useUserData } from "../hooks/useUserData";
import { useToggle } from "@/hooks/useToggle";

// Types
import type { ReactNode } from "react";
import type { Data, StatefulData } from "../services/types";
import type { SoilDatabase } from "..";

type BaseUserDataContext<T2 extends keyof SoilDatabase, T3 extends object = {}> = {
  data: Record<string, StatefulData<T2>>;
  dataArray: Mandate<Data<T2>, "key">[];
  dataMutations: T3;
  turnDataOn: VoidFunction;
};

export const createUserDataContext = <T2 extends keyof SoilDatabase, T3 extends object = {}>(
  dataType: T2,
  getDataMutations?: (data: Record<string, StatefulData<T2>>, dataArray: Mandate<Data<T2>, "key">[]) => T3
) => {
  const UserDataContext = createContext<Maybe<BaseUserDataContext<T2, T3>>>(undefined);

  const useUserDataFromContext = () => {
    const useContextResult = useContext(UserDataContext);

    if (!useContextResult) throw new Error(`You must wrap your component in an instance of the ${dataType} context`);

    const { data, dataArray, dataMutations, turnDataOn } = useContextResult;

    useEffect(() => {
      turnDataOn();
    }, [turnDataOn]);

    return { data, dataArray, dataMutations };
  };

  const UserDataContextProviderComponent = ({ children }: { children: ReactNode }) => {
    const { initiallyLoading, userUid } = useSoilContext();
    const [dataOn, _, turnDataOn] = useToggle(true);

    const { data, dataArray } = useUserData({
      uid: userUid,
      dataType,
      fetchData: true,
      includeArray: true,
      enabled: !initiallyLoading && dataOn,
    });

    const dataMutations = useMemo(() => getDataMutations?.(data, dataArray) ?? ({} as T3), [data, dataArray]);

    const ctx = {
      data,
      dataArray,
      dataMutations,
      turnDataOn,
    };

    return <UserDataContext.Provider value={ctx}>{children}</UserDataContext.Provider>;
  };

  return { useUserDataFromContext, UserDataContextProviderComponent };
};
