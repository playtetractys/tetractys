import { hours, milliseconds, minutes } from "../time";
import { CURRENCY_MAP } from "./constants";

type FormatOptions = Intl.NumberFormatOptions;

const { NumberFormat } = Intl;
const { abs, log10, pow } = Math;

/** This function gets only the decimal value of a number, rounded to the second decimal place */
export const getDecimalRoundedTo2 = (num: number) => Number((num % 1).toFixed(2));

/**
 * Round to the nearest two decimals, or less
 * For example:
 * ```
 * getNumberRoundedTo2(2) === 2
 * getNumberRoundedTo2(2.1) === 2.1
 * getNumberRoundedTo2(2.11) === 2.11
 * getNumberRoundedTo2(2.119) === 2.12
 * ```
 * https://stackoverflow.com/a/11832950
 */
export const getNumberRoundedTo2 = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

const shortenLargeNumberWithUnit = (number: number) => {
  const units = ["", "k", "M", "B", "T"];

  // what tier? (determines unit)
  const tier = (log10(abs(number)) / 3) | 0; /* eslint-disable-line no-bitwise */

  // if zero, we don't need a suffix
  if (tier === 0) return { amount: number, unit: "" };

  // get suffix and determine scale
  const suffix = units[tier];
  const scale = pow(10, tier * 3);

  // scale number and add suffix
  return {
    amount: number / scale,
    unit: suffix,
  };
};

export const simpleCurrencyDisplay = (amountInDollars: number, currency: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amountInDollars);

export const formatCurrency = (
  amountInCents: number = 0,
  locale: Maybe<string>,
  abbreviateThousands = false,
  stripFractionalPart = false,
  options: FormatOptions = {}
) => {
  const sharedOptions: Intl.NumberFormatOptions = {
    style: "currency" as const,
    currency: CURRENCY_MAP[locale as keyof typeof CURRENCY_MAP] || "USD",
  };

  const numberFormatOptions: FormatOptions =
    stripFractionalPart && amountInCents % 100 === 0
      ? { ...sharedOptions, minimumFractionDigits: 0, maximumFractionDigits: 0 }
      : sharedOptions;
  const formatter = new NumberFormat(locale, {
    ...numberFormatOptions,
    ...options,
  });

  const amountInDollars = amountInCents / 100;
  if (!abbreviateThousands) return `${formatter.format(amountInDollars)}`;

  const { amount, unit } = shortenLargeNumberWithUnit(amountInDollars);

  return `${formatter.format(amount)}${unit}`;
};

const validatePriceNumber = (value: string) => {
  const nanOrNumber = Number(value.replace(/\D/g, ""));
  return { valid: !Number.isNaN(nanOrNumber), nanOrNumber };
};

export const getPriceNumber = (value: string, originalVal: number) => {
  const { valid, nanOrNumber } = validatePriceNumber(value);
  return valid ? nanOrNumber : originalVal;
};

/**
 * @param precision - The number of decimal places to show.
 * ```
 * getHumanReadableBytes(1030, 0, 'byte') === '1 MB';
 * ```
 */
export const getHumanReadableBytes = (bytes: Maybe<number>, precision: number, unit: "byte" | "bit"): string => {
  if (bytes === undefined) return "";

  const base = unit === "byte" ? 1024 : 1000;
  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const unitIndex = Math.floor(Math.log(bytes) / Math.log(base));
  const size = (bytes / Math.pow(base, unitIndex)).toFixed(precision);

  return `${size} ${units[unitIndex]}`;
};

/** `convertMbToBytes(1) === 10485760` */
export const convertMbToBytes = (mb: number) => mb * 1048576;

/** `convertBytesToMb(10485760) === 1` */
export const convertBytesToMb = (bytes: number) => Math.round(bytes / 1048576);

export const formatDurationForVideoDisplay = (duration: number | undefined) => {
  if (!duration) return "0:00";

  const ms = milliseconds(duration);

  const h = Math.floor(ms.in("hours"));
  const m = Math.floor(ms.in("minutes") % hours(1).in("minutes"));
  const s = Math.floor(ms.in("seconds") % minutes(1).in("seconds"));

  return `${h ? `${h}:` : ""}${h ? String(m).padStart(2, "0") : m}:${String(s).padStart(2, "0")}`;
};

export const formatTimeForTimerDisplay = (s: number, version: "sec" | "min" | "full" | "dynamic") => {
  if (s <= 0) {
    if (version !== "full") return "00";
    return "00:00";
  }

  const d = new Date(s);
  const hr = d.getUTCHours().toString();
  const min = d.getUTCMinutes().toString();
  const sec = d.getUTCSeconds().toString();

  if (version === "sec") return sec.padStart(2, "0");
  if (version === "min") return min.padStart(2, "0");

  if (version === "dynamic") {
    if (hr === "0" && min === "0") return sec;
    if (hr === "0") return `${min.padStart(2, "0")}:${sec.padStart(2, "0")}`;
  }

  return `${hr}:${min.padStart(2, "0")}:${sec.padStart(2, "0")}`;
};

export const toUpperCaseFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const sanitizeString = (str: string) => str.replace(/[^a-zA-Z0-9 ]/, "");

/** https://example.com or http://localhost:3000 */
export const constructPathSource = () => {
  if (typeof window === "undefined") return "";

  const { hostname, port, protocol } = window.location;

  return `${protocol}//${hostname}${port && `:${port}`}`;
};

export const addApostrophe = (str: string) => {
  if (str.search(/s$/i) !== -1) return `${str}'`;
  return `${str}'s`;
};

export const arrayWithKeys = <T>(obj: Record<string, T>) =>
  (Object.entries(obj) as [string, T][]).map(([key, value]) => ({
    ...value,
    key,
  }));

/**
 * Transforms:
 * ```
 * [
 *   { key: "someRandomId1", subKey: "otherRandomId1" },
 *   { key: "someRandomId2", subKey: "otherRandomId2" },
 * ]
 * ```
 * Into:
 * ```
 * {
 *   otherRandomId1: { key: "someRandomId1", subKey: "otherRandomId1" },
 *   otherRandomId2: { key: "someRandomId2", subKey: "otherRandomId2" },
 * }
 * ```
 */
export const objectByKey = <K extends string | number, T extends Object & { [Key in K]: string | number }>(
  arr: T[],
  key: K
) => arr.reduce((prev, obj) => ({ ...prev, [obj[key]]: obj }), {} as Record<T[K], T>);

export const objectByNestedKey = <
  PK extends string | number,
  SK extends string | number,
  T extends Object & { [PKey in PK]: { [SKey in SK]: string | number } }
>(
  arr: T[],
  primaryKey: PK,
  secondaryKey: SK
) => arr.reduce((prev, obj) => ({ ...prev, [obj[primaryKey][secondaryKey]]: obj }), {} as Record<T[PK][SK], T>);

export const filterAndPick = <T>(arr: T[], cb: (val: T) => boolean) => {
  const filtered: T[] = [];
  const picked: T[] = [];

  arr.forEach((val) => (cb(val) ? filtered : picked).push(val));

  return { filtered, picked };
};

/**
 * Transforms:
 * ```
 * [
 *   { key: "someRandomId1", subKey: "otherRandomId1" },
 *   { key: "someRandomId2", subKey: "otherRandomId1" },
 *   { key: "someRandomId3", subKey: "otherRandomId2" },
 * ]
 * ```
 * Into:
 * ```
 * {
 *   otherRandomId1: [{ key: "someRandomId1", subKey: "otherRandomId1" }, { key: "someRandomId2", subKey: "otherRandomId1" }],
 *   otherRandomId2: [{ key: "someRandomId3", subKey: "otherRandomId2" }],
 * }
 * ```
 */
export const objectOfArraysByKey = <K extends string | number, T extends Object & { [Key in K]: string | number }>(
  arr: T[],
  key: K
) =>
  arr.reduce(
    (prev, obj) => ({
      ...prev,
      [obj[key]]: prev[obj[key]] ? [...prev[obj[key]], obj] : [obj],
    }),
    {} as Record<T[K], T[]>
  );

export const objectOfArraysByNestedKey = <
  PK extends string | number,
  SK extends string | number,
  T extends Object & { [PKey in PK]: { [SKey in SK]: string | number } }
>(
  arr: T[],
  primaryKey: PK,
  secondaryKey: SK
) =>
  arr.reduce(
    (prev, obj) => ({
      ...prev,
      [obj[primaryKey][secondaryKey]]: prev[obj[primaryKey][secondaryKey]]
        ? [...prev[obj[primaryKey][secondaryKey]], obj]
        : [obj],
    }),
    {} as Record<T[PK][SK], T[]>
  );

export const permitKeys = <T extends object>(keys: (keyof T)[], obj: T) =>
  keys.reduce((prev, curr) => (obj[curr] ? { ...prev, [curr]: obj[curr] } : prev), {} as T);

type SimpleParamValueType = number | string | string[] | boolean | null;
type ParamValueType = Maybe<SimpleParamValueType | Record<string, SimpleParamValueType>>;
/**
 * Builds query param strings
 *
 * @param queryParams `{ foo: "hi there", bar: "100%", submission: { subKey: "nested object" } }`
 * @param prefixKey This is meant for recursive calls of the function (see comment below)
 * @returns `?foo=hi%20there&bar=100%25&submission[subKey]=nested%20object`
 */
export const buildQueryParamsString = (
  queryParams: Record<string, ParamValueType> | { name: string; value: ParamValueType }[],
  prefixKey?: string
) => {
  let stringifiedQueryParams = "";

  if (!prefixKey && Array.isArray(queryParams)) {
    stringifiedQueryParams = queryParams
      .map((paramObj) => `${encodeURIComponent(paramObj.name)}=${encodeURIComponent(String(paramObj.value))}`)
      .join("&");
  } else if (typeof queryParams === "object" && !Array.isArray(queryParams)) {
    stringifiedQueryParams = Object.keys(queryParams)
      .sort()
      .filter((key) => Boolean(queryParams[key]))
      .map((key) => {
        const value = queryParams[key];

        // If the parameter is an object we recursively call `buildQueryParamsString`, but we can only do this once,
        // so we check to make sure `prefixKey` does not exist before calling it recursively
        if (!prefixKey && typeof value === "object") {
          return buildQueryParamsString(value as Record<string, ParamValueType>, key);
        }

        if (prefixKey) {
          if (value && Array.isArray(value)) {
            return value.reduce(
              (prev, val, i) => `${prev ? `${prev}&` : ""}${`${prefixKey}[${key}][${i}]=${encodeURIComponent(val)}`}`,
              ""
            );
          }

          return `${prefixKey ? `${prefixKey}[${key}]` : key}=${encodeURIComponent(String(value))}`;
        }

        return `${key}=${encodeURIComponent(String(value))}`;
      })
      .join("&");
  }

  return stringifiedQueryParams ? `${prefixKey ? "" : "?"}${stringifiedQueryParams}` : "";
};

/**
 * Transforms:
 * ```
 * https://site.com/page?foo=hi%20there&bar=100%25
 * ```
 * Into:
 * ```
 * { foo: "hi there", bar: "100%" }
 * ```
 */
export const deconstructQueryParamsString = (url: string) => {
  const regEx = RegExp(/\?|&/);

  if (url.search(regEx) === -1) return {} as Record<string, string>;

  return decodeURIComponent(url)
    .split(regEx)
    .slice(1)
    .reduce((prev, curr) => {
      const [key, val] = curr.split("=");
      return { ...prev, [key]: val };
    }, {});
};

export type GoogleDays = "mo" | "tu" | "we" | "th" | "fr" | "sa" | "su";
type RecurPattern = {
  FREQ?: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  INTERVAL?: number;
  BYDAY?: GoogleDays[];
  COUNT?: number;
};

/**
 * Without optional prop: https://www.google.com/calendar/render?action=TEMPLATE&text=Your+Event+Name&dates=20140127T224000Z/20140320T221500Z&details=For+details,+link+here:+http://www.example.com&location=Waldorf+Astoria,+301+Park+Ave+,+New+York,+NY+10022&sf=true&output=xml
 * Optional prop adds: &recur=RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=Mo,Tu;COUNT=5;
 * */
export const generateAddToGoogleCalendarUrl = (
  sessionDetails: {
    name: string;
    description: string;
    startsAt: number;
    durationInMinutes: number;
  },
  timeZone: string,
  location: string,
  recur?: {
    recurPattern: RecurPattern;
    joinUrls: string[];
  }
) =>
  `https://www.google.com/calendar/render${buildQueryParamsString({
    text: sessionDetails.name,
    dates: [sessionDetails.startsAt, sessionDetails.startsAt + minutes(sessionDetails.durationInMinutes).ms]
      .map((timestamp) => `${new Date(timestamp).toISOString().slice(0, -4)}Z`)
      .join("/")
      .replace(/-|:|\./g, ""),
    details: recur ? `${sessionDetails.description}\n\n${recur.joinUrls.join("\n\n")}` : sessionDetails.description,
    location,
    ctz: timeZone,
    sf: true,
    output: "xml",
    action: "TEMPLATE",
    recur:
      recur &&
      `RRULE:${(Object.entries(recur.recurPattern) as [keyof RecurPattern, ValueOf<RecurPattern>][]).reduce(
        (prev, [key, val]) => `${prev}${key}=${Array.isArray(val) ? val.join(",") : val};`,
        ""
      )}`,
  })}`;

export const hexToRgb = (hex: string) => {
  let r: number = 0;
  let g: number = 0;
  let b: number = 0;

  if (hex.length === 4) {
    r = Number(`0x${hex[1]}${hex[1]}`);
    g = Number(`0x${hex[2]}${hex[2]}`);
    b = Number(`0x${hex[3]}${hex[3]}`);
  } else if (hex.length === 7) {
    r = Number(`0x${hex[1]}${hex[2]}`);
    g = Number(`0x${hex[3]}${hex[4]}`);
    b = Number(`0x${hex[5]}${hex[6]}`);
  }

  return { r, g, b };
};

export const hexToHsl = (hex: string, options?: { darken: number }) => {
  let { r, g, b } = hexToRgb(hex);

  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  const cmin = Math.min(r, g, b);
  const cmax = Math.max(r, g, b);
  const delta = cmax - cmin;
  let h = 0;
  let s = 0;
  let l = 0;

  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return `hsl(${h},${s}%,${options?.darken ? l - l * options.darken : l}%)`;
};

export const blackOrWhiteFromBackground = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);

  const sum = Math.round((r * 299 + g * 587 + b * 114) / 1000);

  return sum > 128 ? "var(--darkBlack)" : "var(--white)";
};

/** The Fisher-Yates Shuffle */
export const shuffle = <T>(arr: T[]) => {
  const array = [...arr];

  let m = array.length;
  let t: Maybe<T>;
  let i: Maybe<number>;

  while (m) {
    // Pick a remaining element...
    i = Math.floor(Math.random() * m--); // eslint-disable-line no-plusplus

    // ...and swap it with the current element
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
};

export const getButtonColorOverrides = (color: string) => ({
  "--primaryColorOverride": blackOrWhiteFromBackground(color),
  "--primaryAccentOverride": color,
  "--primaryAccentOverrideDarker": hexToHsl(color, { darken: 0.03 }),
  "--primaryAccentOverrideDarkest": hexToHsl(color, { darken: 0.1 }),
});

export function validatePhoneNumber(str: string) {
  const onlyNumbers = str.replace(/\D/g, "");
  if (onlyNumbers.length < 10 || onlyNumbers.length > 12 || (onlyNumbers.length === 11 && onlyNumbers[0] !== "1")) {
    throw Error("Please enter a valid US phone number.");
  }

  return `+${onlyNumbers[0] !== "1" ? "1" : ""}${onlyNumbers}`;
}

/**
 * Converts a string to lowercase and replaces spaces with dashes.
 * @param str The input string to be formatted.
 * @returns The formatted string in lowercase with spaces replaced by dashes.
 */
export function toSlug(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z]+/g, "")
    .replace(/\s+/g, "-");
}
