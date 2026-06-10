/**
 * Formats a date string into a human-readable Indian locale format.
 * @param {string} isoDateString - ISO 8601 date string
 * @returns {string} Formatted date, e.g. "5 Jan 2025"
 */
export function formatActivityDate(isoDateString) {
  return new Date(isoDateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Returns a greeting based on the current hour of the day.
 * @returns {string} Contextual greeting (e.g., "Good morning")
 */
export function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 21) return 'Good evening';
  return 'Good night';
}

/**
 * Returns a long-form formatted date string for display headers.
 * @returns {string} e.g. "Tuesday, 10 June 2025"
 */
export function getFormattedHeaderDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Returns a "Month Year" string for a member-since display.
 * @param {string} isoDateString - ISO 8601 date string
 * @returns {string} e.g. "June 2025"
 */
export function formatMemberSinceDate(isoDateString) {
  if (!isoDateString) return '—';
  return new Date(isoDateString).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Checks if a given date string represents today's date.
 * @param {string|null} isoDateString - ISO 8601 date string or null
 * @returns {boolean} True if the date is today
 */
export function isToday(isoDateString) {
  if (!isoDateString) return false;
  return new Date(isoDateString).toDateString() === new Date().toDateString();
}
