import {
  startOfMonth,
  startOfWeek,
  endOfMonth,
  eachDayOfInterval
} from 'date-fns';

function getToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return today;
}

function capitalize(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

function beforeOvermorrow(date) {
  const tomorrow = getToday();
  tomorrow.setDate(tomorrow.getDate() + 2);

  return date < tomorrow;
}

/**
 * Generates a relative date string in browsers that support RelativeTimeFormat
 * Falls back to a normal date string
 */
export function relativeDate(date) {
  if (!Intl.RelativeTimeFormat || !beforeOvermorrow(date)) {
    return formatDate(date);
  }

  const today = getToday();
  // Rough calculation
  const dayDiff = Math.ceil((today.getTime() - date.getTime()) / 86400000);

  return capitalize(new Intl.RelativeTimeFormat('default', {
    numeric: dayDiff < 7 ? 'auto' : 'always'
  }).format(
    dayDiff < 7 ? -dayDiff : -Math.floor(dayDiff / 7),
    dayDiff < 7 ? 'day' : 'week'
  ));
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('default', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

export function beforeToday(date) {
  return date < getToday();
}

// Week should start on Monday
// There isn't an API for this https://github.com/tc39/ecma402/issues/6
const weekStartsOn = 1;

export function getDayInitials() {
  const date = startOfWeek(new Date(), { weekStartsOn });
  const initials = [];

  for (let n = 0; n < 7; n++) {
    initials.push({
      initial: new Intl.DateTimeFormat('default', {
        weekday: 'narrow'
      }).format(date),
      name: new Intl.DateTimeFormat('default', {
        weekday: 'long'
      }).format(date)
    });
    date.setDate(date.getDate() + 1);
  }

  return initials;
}

/**
 * Generate an array of arrays(weeks) of dates. Dates not in the specified
 * month will included as empty.
 */
export function getWeeksInMonth(date) {
  const start = startOfWeek(startOfMonth(date), { weekStartsOn });
  const end = endOfMonth(date);
  const days = eachDayOfInterval({ start, end });
  const weeks = [];

  days.forEach((day, dayIndex) => {
    const weekIndex = Math.floor(dayIndex / 7);
    if (!weeks[weekIndex]) weeks.push([]);
    const week = weeks[weekIndex];
    week.push(day.getMonth() === date.getMonth() ? day : undefined);
  });

  return weeks;
}

/**
 * Generate an RFC 3339 timestamp without time or timezone
 */
export function getISODateString(date) {
  return date.getFullYear() + '-'
    + String(date.getMonth() + 1).padStart(2, '0') + '-'
    + String(date.getDate()).padStart(2, '0') +
    'T00:00:00.000Z';
}
