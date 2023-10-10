import dayjs from 'dayjs';
import { MAX_TIME } from '../const.js';

function getEventDuration(dateFrom, dateTo) {
  let fullTime = -dayjs(Date.parse(dateFrom)).diff(Date.parse(dateTo), 'minute');

  const minutes = fullTime % MAX_TIME.MINUTES;
  fullTime = (fullTime - minutes) / MAX_TIME.MINUTES;

  const hours = fullTime % MAX_TIME.HOURS;
  fullTime = (fullTime - hours) / MAX_TIME.HOURS;

  const days = `${fullTime}D`;

  return `${fullTime > 0 ? days : ''} ${hours}H ${minutes}M`;
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

function isSameDate(dateA, dateB) {
  return (dateA === null && dateB === null) || dayjs(dateA).isSame(dayjs(dateB));
}

function compareNumbers(dataA, dataB) {
  return dataA - dataB;
}

const sortByDate = (a, b) =>
  compareNumbers(Date.parse(a.dateFrom), Date.parse(b.dateFrom));

const sortByDuration = (a, b) =>
  compareNumbers(
    dayjs(Date.parse(b.dateTo)).diff(Date.parse(b.dateFrom), 'millisecond'),
    dayjs(Date.parse(a.dateTo)).diff(Date.parse(a.dateFrom), 'millisecond')
  );

const sortByPrice = (a, b) => compareNumbers(b.basePrice, a.basePrice);

const humanizeOffers = (offer, event, offersModel) =>
  offersModel
    .getByType(event.type).offers
    .find((item) => item.id === offer);

function capitalizeFirstLetter(string) {
  return (string[0].toUpperCase() +
    string.slice(1));
}

export { getEventDuration, isDateInFuture, isDateToday, isDateInPast,
  sortByDate, sortByDuration, sortByPrice, isSameDate, humanizeOffers,
  capitalizeFirstLetter };
