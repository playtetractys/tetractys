// Services
import { onChildAddedOrderBy, onChildChangedOrderBy, onChildRemovedOrderBy } from "./firebase";

// Helpers
import { PATHS } from "./paths";

// Types
import type { SoilDatabase } from "..";
import type { Data } from "./types";

export const onPublicDataTypeListChildChangedOrderBy = <T2 extends keyof SoilDatabase, T22 extends keyof Data<T2>>(
  dataType: keyof SoilDatabase,
  orderByChild: T22,
  amount: number,
  version: "first" | "last",
  childChanged: (val: number, key: string) => void,
  childRemoved: (key: string) => void
) => {
  const addedOff = onChildAddedOrderBy(
    PATHS.publicDataTypeList(dataType),
    String(orderByChild),
    amount,
    version,
    childChanged
  );
  const changedOff = onChildChangedOrderBy(
    PATHS.publicDataTypeList(dataType),
    String(orderByChild),
    amount,
    version,
    childChanged
  );
  const removedOff = onChildRemovedOrderBy(
    PATHS.publicDataTypeList(dataType),
    String(orderByChild),
    amount,
    version,
    childRemoved
  );

  return () => {
    addedOff();
    changedOff();
    removedOff();
  };
};
