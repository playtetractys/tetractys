// eslint-disable-next-line no-use-before-define
import React, { createContext, useContext, useEffect } from "react";

// Helpers
import { useConnectionsTypeData } from "../hooks/useConnectionsTypeData";
import { useToggle } from "@/hooks/useToggle";

// Types
import type { ReactNode } from "react";
import type { Data } from "../services/types";
import type { SoilDatabase } from "..";

type BaseConnectionsTypeDataContext<T2 extends keyof SoilDatabase> = {
  data: Record<string, Data<T2>>;
  dataArray: Mandate<Data<T2>, "key">[];
  turnDataOn: VoidFunction;
};

export const createConnectionsTypeDataContext = <T2 extends keyof SoilDatabase, T22 extends keyof SoilDatabase>(
  parentType: T2,
  parentKey: string,
  dataType: T22
) => {
  const ConnectionsTypeDataContext = createContext<Maybe<BaseConnectionsTypeDataContext<T22>>>(undefined);

  const useConnectionsTypeDataContext = () => {
    const useContextResult = useContext(ConnectionsTypeDataContext);

    if (!useContextResult) throw new Error(`You must wrap your component in an instance of the ${dataType} context`);

    const { data, dataArray, turnDataOn } = useContextResult;

    useEffect(() => {
      turnDataOn();
    }, [turnDataOn]);

    return { data, dataArray };
  };

  const ConnectionsTypeDataContextProviderComponent = ({ children }: { children: ReactNode }) => {
    const [dataOn, _, turnDataOn] = useToggle(true);

    const { data, dataArray } = useConnectionsTypeData({
      parentType,
      parentKey,
      dataType,
      includeArray: true,
      enabled: dataOn,
    });

    const ctx = {
      data,
      dataArray,
      turnDataOn,
    };

    return <ConnectionsTypeDataContext.Provider value={ctx}>{children}</ConnectionsTypeDataContext.Provider>;
  };

  return { useConnectionsTypeDataContext, ConnectionsTypeDataContextProviderComponent };
};
