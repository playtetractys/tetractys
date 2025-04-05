import {
  IANNA_TIME_ZONES,
  DAY_OF_WEEK,
  ONE_MINUTE_IN_MS,
  ONE_HOUR_IN_MS,
  ONE_DAY_IN_MS,
  ONE_MONTH_IN_MS,
  ONE_YEAR_IN_MS,
} from "./constants";
import type { N, Period, TimeUnit } from "./types";

// -----------------------------------------------------------------------
// allows trivial and type-checked conversion between units of time. ex:
//
// hours(36).in('days') -> 1.5
// milliseconds(days(365).in('milliseconds')).in('years') -> 1
// minutes(15).in('milliseconds') -> 900000 (currently used)
//
// etc.
// -----------------------------------------------------------------------------------------
const t = new Map<TimeUnit, number>();
const get = (key: TimeUnit) => t.get(key)!;

const numberOfMillisecondsIn = t
  .set("milliseconds", 1)
  .set("seconds", 1_000 * get("milliseconds"))
  .set("minutes", 60 * get("seconds"))
  .set("hours", 60 * get("minutes"))
  .set("days", 24 * get("hours"))
  .set("weeks", 7 * get("days"))
  .set("years", 365 * get("days"));

export const getConverter = (numUnits: N, unit: TimeUnit) => {
  const ms = numUnits * numberOfMillisecondsIn.get(unit)!;

  return {
    in(u: TimeUnit) {
      return ms / numberOfMillisecondsIn.get(u)!;
    },

    ms,
  };
};

export const milliseconds = (numUnits: N) => getConverter(numUnits, "milliseconds");
export const seconds = (numUnits: N) => getConverter(numUnits, "seconds");
export const minutes = (numUnits: N) => getConverter(numUnits, "minutes");
export const hours = (numUnits: N) => getConverter(numUnits, "hours");
export const days = (numUnits: N) => getConverter(numUnits, "days");
export const weeks = (numUnits: N) => getConverter(numUnits, "weeks");
export const years = (numUnits: N) => getConverter(numUnits, "years");
// -----------------------------------------------------------------------------------------

/**
 * Moves the date forwards or backwards by as many months as is passed into direction (positive or negative)
 * @param now Epoch timestamp
 * @param direction Positive or number number representing the number of months to move
 * @returns Epoch timestamp
 * ```
 * moveMonth(Date.now(), -3);
 * ```
 */
export const moveMonth = (now: number, direction: number) =>
  new Date(now).setMonth(new Date(now).getMonth() + direction);

/** Gets the start of the month to the millisecond, so the end of the previous month is the return value minus 1 */
export const getMonthStart = (d: Date) => new Date(d.setDate(1)).setHours(0, 0, 0, 0);

export const getBillingPeriodTimeFromSubscription = (period: Period, interval: number) => {
  switch (period) {
    case "day":
      return days(interval);
    case "week":
      return weeks(interval);
    case "month":
      return days(interval * 30);
    case "year":
      return years(interval);
    default:
      return days(0);
  }
};

/** Wed 6/30/2021, 10:08 AM for US Locale */
export const getFullDisplayTime = (timestamp: number, locale = "default") => {
  const timeAndDate = Intl.DateTimeFormat(locale, {
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
  const dayOfWeek = new Date(timestamp).getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;

  return `${DAY_OF_WEEK[dayOfWeek]} ${timeAndDate}`;
};

/** Wed 6/30 for US Locale */
export const getWeekdayAndDate = (timestamp: number, locale = "default") => {
  const timeAndDate = Intl.DateTimeFormat(locale, {
    month: "numeric",
    day: "numeric",
  }).format(new Date(timestamp));
  const dayOfWeek = new Date(timestamp).getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;

  return `${DAY_OF_WEEK[dayOfWeek]} ${timeAndDate}`;
};

/** 4th */
export const getDateWithEnglishOrdinalSuffix = (timestamp: number) => {
  const date = new Date(timestamp);

  let suffix = "";
  if (date.getDate() % 10 === 1 && date.getDate() !== 11) suffix = "st";
  else if (date.getDate() % 10 === 2 && date.getDate() !== 12) suffix = "nd";
  else if (date.getDate() % 10 === 3 && date.getDate() !== 13) suffix = "rd";
  else suffix = "th";

  return date.getDate() + suffix;
};

/** 3:04 PM for US Locale */
export const getDisplayTime = (timestamp: number, locale = "default") => {
  const date = Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));

  return date;
};

/** "America/New_York" to "EST" for US Locale */
export const getDisplayTimezone = (timeZone: string, version: "long" | "short" = "short") => {
  const date = Intl.DateTimeFormat("default", {
    timeZone,
    timeZoneName: version,
  }).format(Date.now());

  return date.split(", ")[1];
};

/** 3:04 PM EST for US Locale */
export const getDisplayTimeWithTimezone = (timestamp: number, locale = "default", timeZone?: string) => {
  const date = Intl.DateTimeFormat(locale, {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(timestamp));

  return date;
};

/** Wed 6/30/2021, 10:08 AM PDT for US Locale */
export const getDisplayDateWithTimezone = (timestamp: number, locale = "default", timeZone?: string) => {
  const date = Intl.DateTimeFormat(locale, {
    timeZone,
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(timestamp));
  const dayOfWeek = new Date(timestamp).getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;

  return `${DAY_OF_WEEK[dayOfWeek]} ${date}`;
};

export const getUTCHour = (timestamp: number, locale = "default") => {
  const date = Intl.DateTimeFormat(locale, {
    timeZone: "UTC",
    hour: "numeric",
  }).format(new Date(timestamp));

  return date;
};

/** 3/15 for US Locale */
export const getDisplayDate = (
  timestamp: number,
  { locale = "default", options }: { locale?: string; options?: Intl.DateTimeFormatOptions } = {
    locale: "default",
  }
) => {
  const date = Intl.DateTimeFormat(locale, {
    month: "numeric",
    day: "numeric",
    ...options,
  }).format(new Date(timestamp));

  return date;
};

/** Converts 2024-03-15 to 3/15 for US Locale */
export const convertToDisplayDate = (dateString: string) => {
  const [, m, d] = dateString.split("-");

  return `${String(Number(m))}/${String(Number(d))}`;
};

/** 3/15/2021 for US Locale */
export const getDisplayDateWithYear = (
  timestamp: number,
  { locale = "default", options }: { locale?: string; options?: Intl.DateTimeFormatOptions } = {
    locale: "default",
  }
) => {
  const date = Intl.DateTimeFormat(locale, {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    ...options,
  }).format(new Date(timestamp));

  return date;
};

/** epoch timestamp to 2021-03-15 - pair with `convertNativeDateInputToMs` */
export const getDateForNativeInput = (
  timestamp: number,
  { locale = "default", options }: { locale?: string; options?: Intl.DateTimeFormatOptions } = {
    locale: "default",
  }
) => {
  const [mo, da, yr] = Intl.DateTimeFormat(locale, {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    ...options,
  })
    .format(new Date(timestamp))
    .split("/");

  return `${yr}-${mo}-${da}`;
};

/** 2021-03-15 to epoch timestamp - pair with `getDateForNativeInput` */
export const convertNativeDateInputToMs = (value: Maybe<string>) => {
  if (!value) return undefined;

  // Value is read as UTC by Date if in UTC format yyyy-mm-dd so we have to convert it to US format
  const [y, m, d] = value.split("-");
  const newDate = new Date(`${m}/${d}/${y}`);
  newDate.setHours(0);
  newDate.setMinutes(0);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  const ms = newDate.valueOf();

  return Number.isNaN(ms) ? undefined : ms;
};

/** Get universal time 2024-03-15 */
export function getFormattedUTCTime(timestamp?: number): string {
  const now = timestamp ? new Date(timestamp) : new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based, so we add 1
  const day = String(now.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/** July 15 for US Locale */
export const getDisplayDateFullMonth = (
  timestamp: number,
  { locale = "default", options }: { locale?: string; options?: Intl.DateTimeFormatOptions } = {
    locale: "default",
  }
) => {
  const date = Intl.DateTimeFormat(locale, {
    month: "long",
    day: "numeric",
    ...options,
  }).format(new Date(timestamp));

  return date;
};

/** July 15, 2020 for US Locale */
export const getDisplayDateFullMonthAndYear = (
  timestamp: number,
  { locale = "default", options }: { locale?: string; options?: Intl.DateTimeFormatOptions } = {
    locale: "default",
  }
) => {
  const date = Intl.DateTimeFormat(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
    ...options,
  }).format(new Date(timestamp));

  return date;
};

/** Fri, Dec 10, 2021 for US Locale */
export const getDisplayDateDayFullMonthAndYear = (
  timestamp: number,
  { locale = "default", options }: { locale?: string; options?: Intl.DateTimeFormatOptions } = {
    locale: "default",
  }
) => {
  const date = Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  }).format(new Date(timestamp));
  const dayOfWeek = new Date(timestamp).getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;

  return `${DAY_OF_WEEK[dayOfWeek]}, ${date}`;
};

/** July 2021 for US Locale */
export const getDisplayFullMonthYear = (
  timestamp: number,
  { locale = "default", options }: { locale?: string; options?: Intl.DateTimeFormatOptions } = {
    locale: "default",
  }
) => {
  const date = Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
    ...options,
  }).format(new Date(timestamp));

  return date;
};

/** 02/06/2021 at 4:00 AM EST */
export const getDateTimeForEmail = (
  timestamp: number,
  locale: string,
  timeZone: Intl.DateTimeFormatOptions["timeZone"]
) => {
  const date = getDisplayDateWithYear(timestamp, {
    locale,
    options: { timeZone },
  });
  const time = getDisplayTimeWithTimezone(timestamp, locale, timeZone).split("-")[0];

  return `${date} at ${time}`;
};

/**
 * If the `timestamp` is less than now minus `hoursFrom`, it will show the time, otherwise it will show the time and the date.
 * Essentially, the default behavior is to show the time and only include the date if it isn't today, ignoring the future.
 */
export const getTimeOrDate = (timestamp: number, hoursFrom: number = 24) => {
  const now = Date.now();

  if (timestamp < now - hours(hoursFrom).ms) {
    return `${getDisplayDateFullMonth(timestamp)} ${getDisplayTime(timestamp)}`;
  }
  return getDisplayTime(timestamp);
};

export const getMonday = (date: Date) => {
  const newDate = new Date(date);

  newDate.setHours(0, 0, 0, 0);

  const day = newDate.getDay();
  const diff = newDate.getDate() - day + (day === 0 ? -6 : 1); // Account for Sunday

  return new Date(newDate.setDate(diff));
};

export const getSundayAtMidnightUTC = (today: boolean = false, initialMs: number = Date.now()) => {
  const now = new Date(initialMs); // Current date and time
  now.setUTCMinutes(0); // Set minutes to 0
  now.setUTCSeconds(0); // Set seconds to 0
  now.setUTCMilliseconds(0); // Set milliseconds to 0
  now.setUTCHours(0); // Set hours to 0 to get to midnight

  const dayOfWeek = now.getUTCDay(); // Sunday - 0, Monday - 1, ..., Saturday - 6
  const daysUntilNextSunday = (7 - dayOfWeek) % 7; // Calculate days until next Sunday

  let nextSundayMidnight = new Date(now);
  if (daysUntilNextSunday === 0 && !today) {
    nextSundayMidnight = new Date(moveDate(nextSundayMidnight, 7));
  } else {
    nextSundayMidnight.setUTCDate(now.getUTCDate() + daysUntilNextSunday); // Move to next Sunday
  }

  return nextSundayMidnight.getTime();
};

export const isSameMonthDate = (day1: Date, day2: Date = new Date()) =>
  day1.getMonth() === day2.getMonth() && day1.getDate() === day2.getDate();

export const isSameYearMonthDate = (day1: Date, day2: Date = new Date()) =>
  day1.getFullYear() === day2.getFullYear() && day1.getMonth() === day2.getMonth() && day1.getDate() === day2.getDate();

export const isToday = (day: Date) => isSameYearMonthDate(day);

export const convertToMilitaryTime = (timestamp: number) => {
  const d = new Date(timestamp);
  const hr = d.getHours();
  const min = d.getMinutes();

  const minAdjusted = min < 10 ? String(min).padStart(2, "0") : String(min);

  return Number(`${hr}${minAdjusted}`);
};

/** 1630 becomes 4:30 PM for US Locale */
export const convertFromMilitaryTime = (militaryTime: number) => {
  const hr = Math.floor(militaryTime / 100);
  const min = militaryTime % 100;

  const amOrPm = hr >= 12 ? "PM" : "AM";
  let adjuster = 0;
  if (hr === 0) adjuster = 12;
  else if (hr >= 13) adjuster = -12;

  return `${hr + adjuster}:${String(min).padEnd(2, "0")} ${amOrPm}`;
};

export const convertMilitaryTimeToHours = (militaryTime: number) => {
  const hr = Math.floor(militaryTime / 100);
  const min = minutes(militaryTime % 100).in("hours");

  return hr + min;
};

export const getMilitaryTimeFromTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);

  return date.getHours() * 100 + date.getMinutes();
};

/** DO NOT USE outside of setting selected times on startsAt (e.g. AvailabilityForm) */
export const setMilitaryTimeOnDate = (militaryTime: number, startsAt: number) => {
  const date = new Date(startsAt);
  const time = convertMilitaryTimeToHours(militaryTime);
  const hrsNoMinutes = Math.floor(time);
  const minutesNoHrs = hours(time % 1).in("minutes");

  date.setHours(hrsNoMinutes, minutesNoHrs, 0, 0);

  return date.valueOf();
};

export const setUSADateOnTimestamp = (ymd: string, startsAt: number) => {
  const [m, d, y] = ymd.split("-");
  const date = new Date(startsAt);

  return date.setFullYear(Number(y), Number(m) - 1, Number(d));
};

export const setDateOnTimestamp = (ymd: string, timestampMs: number) => {
  const [y, m, d] = ymd.split("-");
  const date = new Date(timestampMs);

  // The month arg is zero-based, so subtract `1` from it
  return date.setFullYear(Number(y), Number(m) - 1, Number(d));
};

export const setTimeOnDate = (timeDatetime: number, dateDatetime: number) => {
  const dateDate = new Date(dateDatetime);
  const timeDate = new Date(timeDatetime);

  return dateDate.setHours(
    timeDate.getHours(),
    timeDate.getMinutes(),
    timeDate.getSeconds(),
    timeDate.getMilliseconds()
  );
};

export const getStartTimePlusDuration = (startTime: number, durationInMinutesMultiple: number) => {
  const startTimeInHours = convertMilitaryTimeToHours(startTime);
  const startTimeInMinutes = hours(startTimeInHours).in("minutes");
  const durationInHoursMultiple = minutes(durationInMinutesMultiple).in("hours");

  const hrs = Math.floor(startTimeInHours + durationInHoursMultiple) * 100;
  const min = (startTimeInMinutes + durationInMinutesMultiple) % hours(1).in("minutes");

  return Math.round(hrs + min);
};

export const getMinutesBetweenMilitaryTimes = (startTime: number, endTime: number) => {
  const startHrs = convertMilitaryTimeToHours(startTime);
  const endHrs = convertMilitaryTimeToHours(endTime);

  return Math.round(hours(endHrs - startHrs).in("minutes"));
};

export const getStartAndEndMilitaryTimes = (startsAt: number, durationInMinutes: number) => {
  const startTime = getMilitaryTimeFromTimestamp(startsAt);
  const endTime = getStartTimePlusDuration(startTime, durationInMinutes);

  return { startTime, endTime };
};

/** `moveDate(new Date(), -1)` will return the epoch time for yesterday */
export const moveDate = (d: Date, move: number) => new Date(d).setDate(d.getDate() + move);

/**
 * This function gets the GMT offset from the passed timeZone, but it is fissueed in that it does not account for DST.
 * For example, if it is currently DST for the browser, other timeZones without DST will be an hour off.
 */
export const getGmtDiff = (timeZone: (typeof IANNA_TIME_ZONES)[number]["key"]) => {
  const date = new Date();
  const GMT_TIME_UTC_DATE = date.getUTCDate();
  const GMT_TIME_HOURS = date.getUTCHours();
  const GMT_TIME_MIN = date.getUTCMinutes();

  const timeZoneDate = new Date(new Date().toLocaleString("en-US", { timeZone }));

  const h = timeZoneDate.getHours();

  // NOTE: Remember that adding a negative number subtracts
  let dateLineOffset = 0;
  if (timeZoneDate.getDate() < GMT_TIME_UTC_DATE) dateLineOffset = -24;
  if (timeZoneDate.getDate() > GMT_TIME_UTC_DATE) dateLineOffset = 24;

  const hrs = h - GMT_TIME_HOURS + dateLineOffset;

  let plusOrMinus = " ";
  if (hrs > 0) plusOrMinus = "+";
  if (hrs < 0) plusOrMinus = "-";

  // NOTE: Remember that adding a negative number subtracts
  const minDiff = timeZoneDate.getMinutes() - GMT_TIME_MIN;
  const hrsAccountingMinutes = minDiff < 0 ? hrs + minutes(minDiff).in("hours") : hrs;

  // NOTE: Remember that adding a negative number subtracts
  const finalHours = String(Math.abs(Math.floor(hrsAccountingMinutes))).padStart(2, "0");
  const finalMinutes = String(minDiff < 0 ? 60 + minDiff : minDiff).padStart(2, "0");

  return `(GMT${plusOrMinus}${finalHours}:${finalMinutes})`;
};

/**
 * ! DO NOT USE - This generally encourages bad practices. This was necessary in the migration to
 * grab the `timezone` from the user and apply it to the military times being set on timestamps
 * @param startsAt The ISO string of the timestamp
 * @param startTime The military time meant to be placed on the timestamp
 * @param timeZone The timeZone of the military time
 */
export const setStartTimeOnStartsAt = (startsAt: string, startTime: number, timeZone: string) => {
  const serverObj = new Date(startsAt);
  const serverDate = serverObj.getDate();
  const serverHrs = serverObj.getHours();
  const serverMin = serverObj.getMinutes();

  const timeZoneDate = new Date(new Date(startsAt).toLocaleString("en-US", { timeZone }));
  const timeZoneHrs = timeZoneDate.getHours();

  // NOTE: Remember that adding a negative number subtracts
  let dateLineOffset = 0;
  if (timeZoneDate.getDate() < serverDate) dateLineOffset = -24;
  if (timeZoneDate.getDate() > serverDate) dateLineOffset = 24;

  const hrs = serverHrs + dateLineOffset - timeZoneHrs;

  // NOTE: Remember that adding a negative number subtracts
  const minDiff = timeZoneDate.getMinutes() - serverMin;
  const hrsAccountingMinutes = minDiff < 0 ? hrs + minutes(minDiff).in("hours") : hrs;

  const finalHours = Math.floor(hrsAccountingMinutes);
  const finalMinutes = minDiff < 0 ? 60 + minDiff : minDiff;

  const militaryTime = convertMilitaryTimeToHours(startTime);
  const militaryHrsNoMinutes = Math.floor(militaryTime);
  const militaryMinutesNoHrs = hours(militaryTime % 1).in("minutes");

  // NOTE: Remember that adding a negative number subtracts
  const militaryHoursAfterTimeZone = militaryHrsNoMinutes + finalHours;
  const militaryMinutesAfterTimeZone = militaryMinutesNoHrs + finalMinutes;

  return new Date(startsAt).setHours(militaryHoursAfterTimeZone, militaryMinutesAfterTimeZone, 0, 0).valueOf();
};

const getTimeDifferenceString = (num: number, unit: string, includeAgo = true) => {
  const past = num > 0;
  const rounded = Math.round(Math.abs(num));

  return `${past ? "" : "in "}${rounded} ${unit}${rounded === 1 ? "" : "s"}${past && includeAgo ? " ago" : ""}`;
};

export const timeDifference = (previous: number, current = Date.now(), includeAgo = true) => {
  const diff = current - previous;
  if (diff < ONE_MINUTE_IN_MS) return `seconds ${includeAgo ? " ago" : ""}`;
  if (diff < ONE_HOUR_IN_MS) return getTimeDifferenceString(diff / ONE_MINUTE_IN_MS, "minute", includeAgo);
  if (diff < ONE_DAY_IN_MS) return getTimeDifferenceString(diff / ONE_HOUR_IN_MS, "hour", includeAgo);
  if (diff < ONE_MONTH_IN_MS) return getTimeDifferenceString(diff / ONE_DAY_IN_MS, "day", includeAgo);
  if (diff < ONE_YEAR_IN_MS) return getTimeDifferenceString(diff / ONE_MONTH_IN_MS, "month", includeAgo);
  return getTimeDifferenceString(diff / ONE_YEAR_IN_MS, "year", includeAgo);
};

export function getLast30Days(): string[] {
  const dates: string[] = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(getFormattedUTCTime(date.valueOf()));
  }

  return dates;
}
