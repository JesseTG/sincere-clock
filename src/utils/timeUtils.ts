import {Temporal, Intl} from 'temporal-polyfill';

// TODO: What if the locale is changed at runtime? Can that happen?
const localDateTimeFormat = new Intl.DateTimeFormat([], {hour: "2-digit", minute: "2-digit", second: "2-digit"});

export function localTime(): string {
    const now = Temporal.Now.instant(); // TODO: Get the time from one of the Python backend functions

    // TODO: Create a Intl.DateTimeFormat and use its format() method,
    // so that it doesn't have to keep looking up the same localization format strings
    return localDateTimeFormat.format(now);
}

export function format(temporal: Temporal.Instant | Temporal.Duration): string {
    if (temporal instanceof Temporal.Instant) {
        return localDateTimeFormat.format(temporal);
    }

    // HACK: Workaround for Intl.DurationFormat not being available in the polyfill
    const hours = Math.floor(temporal.total({unit: "hour"}));
    const minutes = Math.floor(temporal.total({unit: "minute"})) % 60;
    const seconds = Math.floor(temporal.total({unit: "second"})) % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    // return temporal.toLocaleString([], {style: "digital", hours: "2-digit", fractionalDigits: 0});
}