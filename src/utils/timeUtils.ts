import { Temporal, Intl } from 'temporal-polyfill';

// TODO: What if the locale is changed at runtime? Can that happen?
const localDateTimeFormat = new Intl.DateTimeFormat([], {hour: "2-digit", minute: "2-digit", second: "2-digit"});

export function localTime(): string {
  const now = Temporal.Now.instant(); // TODO: Get the time from one of the Python backend functions

  // TODO: Create a Intl.DateTimeFormat and use its format() method,
  // so that it doesn't have to keep looking up the same localization format strings
  return localDateTimeFormat.format(now);
}
