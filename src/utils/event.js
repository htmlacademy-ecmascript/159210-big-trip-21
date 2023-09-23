import dayjs from 'dayjs';

function isDateInFuture(date) {
  return date && dayjs().isBefore(dayjs(date), 'D');
}

function isDateToday(date) {
  return date && dayjs().isSame(dayjs(date), 'D');
}

function isDateInPast(date) {
  return date && dayjs().isAfter(dayjs(date), 'D');
}

function updateEvent(events, update) {
  return events.map((event) => event.id === update.id ? update : event);
}

export { isDateInFuture, isDateToday, isDateInPast, updateEvent };
