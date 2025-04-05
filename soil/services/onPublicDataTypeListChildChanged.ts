import type { SoilDatabase } from "..";
import { PATHS } from "./paths";
import { onChildAdded, onChildChanged, onChildRemoved } from "./firebase";

export const onPublicDataTypeListChildChanged = (
  dataType: keyof SoilDatabase,
  childChanged: (val: number, key: string) => void,
  childRemoved: (key: string) => void
) => {
  const addedOff = onChildAdded(PATHS.publicDataTypeList(dataType), childChanged);
  const changedOff = onChildChanged(PATHS.publicDataTypeList(dataType), childChanged);
  const removedOff = onChildRemoved(PATHS.publicDataTypeList(dataType), childRemoved);

  return () => {
    addedOff();
    changedOff();
    removedOff();
  };
};
