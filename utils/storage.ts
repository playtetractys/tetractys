const SET_LOCAL_EVENT_PREFIX = "SetLocal:";
const REMOVE_LOCAL_EVENT_PREFIX = "RemoveLocal:";

export type CustomLocalStorage = {
  Version: number;
  GeoLocation: Nullable<{ longitude: number; latitude: number }>;
};

const parseValue = <T extends keyof CustomLocalStorage>(
  value: Nullable<string>,
  fallback: Nullable<CustomLocalStorage[T]>
) => {
  if (value === null) {
    return fallback;
  }

  try {
    return JSON.parse(value) as CustomLocalStorage[T];
  } catch {
    return value;
  }
};

/**
 * Sets local storage with type safety
 * @param key The local storage key
 * @param data The local storage value
 */
export const setLocal = <T extends keyof CustomLocalStorage>(key: T, data: CustomLocalStorage[T]) =>
  localStorage.setItem(key, JSON.stringify(data));

/**
 * Retrieves the value from local storage with type safety
 * @param key The local storage key
 * @param fallback - (optional) The default value to return if the key is not found. Defaults to null.
 */
export const getLocal = <T extends keyof CustomLocalStorage>(
  key: T,
  fallback: Nullable<CustomLocalStorage[T]> = null
) => {
  if (typeof window !== "undefined") {
    const value: Nullable<string> = localStorage.getItem(key);

    return parseValue<T>(value, fallback);
  }
  return null;
};

/**
 * Removes the value from local storage with type safety
 * @param key The local storage key
 */
export const removeLocal = (key: keyof CustomLocalStorage) => localStorage.removeItem(key);

/*
███████╗██╗   ██╗███████╗███╗   ██╗████████╗███████╗
██╔════╝██║   ██║██╔════╝████╗  ██║╚══██╔══╝██╔════╝
█████╗  ██║   ██║█████╗  ██╔██╗ ██║   ██║   ███████╗
██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║╚██╗██║   ██║   ╚════██║
███████╗ ╚████╔╝ ███████╗██║ ╚████║   ██║   ███████║
╚══════╝  ╚═══╝  ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝
*/
export const setLocalWithEvent = (key: keyof CustomLocalStorage, data: any) => {
  const listenKey = `${SET_LOCAL_EVENT_PREFIX}${key}`;
  document.dispatchEvent(new Event(listenKey));

  setLocal(key, data);
};

export const addSetLocalEventListener = (key: keyof CustomLocalStorage, cb: VoidFunction) => {
  document.addEventListener(`${SET_LOCAL_EVENT_PREFIX}${key}`, cb);
  return () => document.removeEventListener(`${SET_LOCAL_EVENT_PREFIX}${key}`, cb);
};

export const removeLocalWithEvent = (key: keyof CustomLocalStorage) => {
  const listenKey = `${REMOVE_LOCAL_EVENT_PREFIX}${key}`;
  document.dispatchEvent(new Event(listenKey));

  removeLocal(key);
};

export const addRemoveLocalEventListener = (key: keyof CustomLocalStorage, cb: VoidFunction) => {
  document.addEventListener(`${REMOVE_LOCAL_EVENT_PREFIX}${key}`, cb);
  return () => document.removeEventListener(`${REMOVE_LOCAL_EVENT_PREFIX}${key}`, cb);
};
