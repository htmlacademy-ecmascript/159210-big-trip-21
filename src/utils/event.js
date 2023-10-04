import dayjs from 'dayjs';
import { MAX_TIME } from '../const.js';

function getEventDuration(startTime, endTime) {
  let fullTime = -dayjs(Date.parse(startTime)).diff(Date.parse(endTime), 'minute');

  const minutes = fullTime % MAX_TIME.MINUTES;
  fullTime = (fullTime - minutes) / MAX_TIME.MINUTES;

  const hours = fullTime % MAX_TIME.HOURS;
  fullTime = (fullTime - hours) / MAX_TIME.HOURS;

  const days = fullTime;

  return `${days}D ${hours}H ${minutes}M`;
}

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

function compareNumbers(dataA, dataB) {
  return dataA - dataB;
}

const sortByDate = (a, b) =>
  compareNumbers(Date.parse(a.date), Date.parse(b.date));

const sortByDuration = (a, b) =>
  compareNumbers(
    dayjs(Date.parse(a.endTime)).diff(Date.parse(a.startTime), 'millisecond'),
    dayjs(Date.parse(b.endTime)).diff(Date.parse(b.startTime), 'millisecond')
  );

const sortByPrice = (a, b) => compareNumbers(a.price, b.price);

export { getEventDuration, isDateInFuture, isDateToday, isDateInPast, updateEvent,
  sortByDate, sortByDuration, sortByPrice };
