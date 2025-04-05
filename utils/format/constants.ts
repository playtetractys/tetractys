/** This regex permissively validates a date in US format (it only permits a valid full or partial date). The JS should handle adding slashes or dashes. */
export const DATE_PERMISSIVE_REGEX = /(0[1-9]?|1[012]?)((\/|-)(0[1-9]?|[12][0-9]?|3[01]?)((\/|-)([0-9]{1,4}))?)?/;

export const HEX_COLOR_REGEX = /#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;

export const DEFAULT_LOCALE = "en-US" as const;

export const CURRENCY_MAP = {
  "en-GB": "GBP",
  "en-US": "USD",
} as const;

export const LOCALE_COUNTRY_MAP = {
  "en-US": "US",
  "en-GB": "GB",
  US: "en-US",
  GB: "en-GB",
} as const;

export const VALID_LOCALES: Readonly<(keyof typeof CURRENCY_MAP)[]> = ["en-US", "en-GB"] as const;
