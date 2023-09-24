import dayjs from 'dayjs';
import { MAX_TIME } from '../const.js';

let isDeacreaseNeeded = false;

function calculateTime(firstTime, secondTime, maxTime) {
  let calculatedTime;
  const addNumber = isDeacreaseNeeded ? -1 : 0;
  const basicCalc = firstTime - secondTime;
  if (firstTime - secondTime < 0) {
    isDeacreaseNeeded = true;
    calculatedTime = maxTime + basicCalc;
  } else {
    isDeacreaseNeeded = false;
    calculatedTime = basicCalc;
  }

  return calculatedTime + addNumber;
}

function getEventDuration(startTime, endTime) {
  const minutes = calculateTime(dayjs(endTime).get('minute'), dayjs(startTime).get('minute'), MAX_TIME.MINUTES);
  const hours = calculateTime(dayjs(endTime).get('hour'), dayjs(startTime).get('hour'), MAX_TIME.HOURS);
  const days = calculateTime(dayjs(endTime).get('date'), dayjs(startTime).get('date'), MAX_TIME.DAYS);
  const month = isDeacreaseNeeded ? (dayjs(endTime).get('month') + 1) - (dayjs(startTime).get('month') + 1) - 1 :
    (dayjs(endTime).get('month') + 1) - (dayjs(startTime).get('month') + 1);

  return `${month * MAX_TIME.DAYS + days}D ${hours}H ${minutes}M`;
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

const sortByDate = (arrayOfObjects) =>
  arrayOfObjects.sort((a, b) => compareNumbers(Date.parse(a.date), Date.parse(b.date)));

const sortByDuration = (arrayOfObjects) =>
  arrayOfObjects.sort((a, b) =>
    compareNumbers(
      dayjs(Date.parse(a.endTime)).diff(Date.parse(a.startTime), 'millisecond'),
      dayjs(Date.parse(b.endTime)).diff(Date.parse(b.startTime), 'millisecond')
    )
  );

const sortByPrice = (arrayOfObjects) =>
  arrayOfObjects.sort((a, b) => compareNumbers(a.price, b.price));

export { getEventDuration, isDateInFuture, isDateToday, isDateInPast, updateEvent,
  sortByDate, sortByDuration, sortByPrice };
