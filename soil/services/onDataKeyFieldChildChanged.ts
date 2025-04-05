import type { SoilDatabase } from "..";
import { PATHS } from "./paths";
import { onChildAdded, onChildChanged, onChildRemoved } from "./firebase";
import { Data } from "./types";

export const onDataKeyFieldChildChanged = <
  T2 extends keyof SoilDatabase,
  T22 extends keyof Data<T2>,
  T extends Data<T2>[T22]
>(
  dataType: T2,
  dataKey: string,
  field: T22,
  childChanged: (val: T[keyof T], key: string) => void,
  childRemoved: (key: string) => void
) => {
  const addedOff = onChildAdded(PATHS.dataKeyField(dataType, dataKey, field), childChanged);
  const changedOff = onChildChanged(PATHS.dataKeyField(dataType, dataKey, field), childChanged);
  const removedOff = onChildRemoved(PATHS.dataKeyField(dataType, dataKey, field), childRemoved);

  return () => {
    addedOff();
    changedOff();
    removedOff();
  };
};
