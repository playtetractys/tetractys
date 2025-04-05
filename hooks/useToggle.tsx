import { useCallback, useEffect, useState } from "react";

type Toggle = () => void;
type SetTrue = () => void;
type SetFalse = () => void;

export type UseToggleResponse = [boolean, Toggle, SetTrue, SetFalse] & {
  value: boolean;
  toggle: Toggle;
  setTrue: SetTrue;
  setFalse: SetFalse;
  toggledMs: number;
};

/**
 * Hook that defines a boolean toggle
 *
 * @param initialValue The initial value of the toggle
 */
export const useToggle = (initialValue: boolean | (() => boolean)): UseToggleResponse => {
  const [value, setValue] = useState(initialValue);
  const [toggledMs, setToggledMs] = useState(Date.now());

  const toggle = useCallback(() => setValue((prev) => !prev), [setValue]);
  const setTrue = useCallback(() => setValue(true), [setValue]);
  const setFalse = useCallback(() => setValue(false), [setValue]);

  useEffect(() => {
    setToggledMs(Date.now());
  }, [value]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ret = [value, toggle, setTrue, setFalse, toggledMs] as any;

  ret.value = value;
  ret.toggle = toggle;
  ret.setTrue = setTrue;
  ret.setFalse = setFalse;
  ret.toggledMs = toggledMs;

  return ret as UseToggleResponse;
};
