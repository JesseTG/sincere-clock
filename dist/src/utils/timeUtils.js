/**
 * Format a Date object to a local time string
 * @param date The date object to format
 * @returns Formatted time string (HH:MM:SS)
 */
export function formatLocalTime(date) {
    return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
}
/**
 * Format elapsed time from a reference date until now
 * @param referenceTime The reference date to calculate elapsed time from
 * @returns Formatted elapsed time string (HH:MM:SS)
 */
export function formatElapsedTime(referenceTime) {
    const now = new Date();
    let elapsedMs = now.getTime() - referenceTime.getTime();
    if (elapsedMs < 0) {
        elapsedMs = 0;
    }
    // Calculate hours, minutes, seconds
    const seconds = Math.floor((elapsedMs / 1000) % 60);
    const minutes = Math.floor((elapsedMs / (1000 * 60)) % 60);
    const hours = Math.floor(elapsedMs / (1000 * 60 * 60));
    // Format with leading zeros
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}
