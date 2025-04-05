import type { SoilDatabase } from "..";
import { PATHS } from "./paths";
import { onChildAddedByQuery, onChildChangedByQuery, onChildRemovedByQuery } from "./firebase";

export const onPublicDataTypeListChildChangedByQuery = (
  dataType: keyof SoilDatabase,
  startAt: string,
  endAt: string,
  childChanged: (val: number, key: string) => void,
  childRemoved: (key: string) => void
) => {
  const addedOff = onChildAddedByQuery(PATHS.publicDataTypeList(dataType), startAt, endAt, childChanged);
  const changedOff = onChildChangedByQuery(PATHS.publicDataTypeList(dataType), startAt, endAt, childChanged);
  const removedOff = onChildRemovedByQuery(PATHS.publicDataTypeList(dataType), startAt, endAt, childRemoved);

  return () => {
    addedOff();
    changedOff();
    removedOff();
  };
};
