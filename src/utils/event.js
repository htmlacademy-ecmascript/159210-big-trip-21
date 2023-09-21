import dayjs from 'dayjs';

function isEventInFuture(date) {
  return date && dayjs().isBefore(dayjs(date), 'D');
}

function isEventToday(date) {
  return date && dayjs().isSame(dayjs(date), 'D');
}

function isEventInPast(date) {
  return date && dayjs().isAfter(dayjs(date), 'D');
}

export { isEventInFuture, isEventToday, isEventInPast };
