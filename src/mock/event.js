import { EVENT_TYPES, DESTINATIONS, MAX_PRICE, MIN_PRICE, OFFERS } from '../const.js';
import { getRandomInteger, getRandomArrayElement, getRandomBoolean, getRandomKey, formalizeTime } from '../utils/common.js';
import dayjs from 'dayjs';
import dayjsRandom from 'dayjs-random';
import dayOfYear from 'dayjs/plugin/dayOfYear';

dayjs.extend(dayjsRandom);
dayjs.extend(dayOfYear);

const getDateTime = () => {
  const eventDate = dayjs().dayOfYear(getRandomInteger(1, 365)).format('YYYY-MM-DD');
  const eventStartTime = `${eventDate}T${formalizeTime(getRandomInteger(0, 23))}:${formalizeTime(Math.floor(getRandomInteger(0, 59) / 5) * 5)}`;
  let endDate;

  do {
    endDate = dayjs().dayOfYear(getRandomInteger(1, 365)).format('YYYY-MM-DD');
  } while (endDate < eventDate);

  const eventEndTime = `${endDate}T${formalizeTime(getRandomInteger(0, 23))}:${formalizeTime(Math.floor(getRandomInteger(0, 59) / 5) * 5)}`;

  return {
    date: eventDate,
    startTime: eventStartTime,
    endTime: eventEndTime
  };
};

function getRandomOffers() {
  const offersCount = getRandomInteger(0, Object.keys(OFFERS).length);
  const offersList = [];
  let newOffer;
  for (let i = 0; i < offersCount; i++) {
    do {
      newOffer = getRandomKey(OFFERS);
    } while (offersList.includes(newOffer));
    offersList.push(newOffer);
  }
  return offersList;
}

function getNewEntry() {
  const newDate = getDateTime();
  return {
    date: newDate.date,
    eventType: getRandomArrayElement(EVENT_TYPES),
    destination: getRandomKey(DESTINATIONS),
    startTime: newDate.startTime,
    endTime: newDate.endTime,
    price: getRandomInteger(MIN_PRICE, MAX_PRICE),
    offers: getRandomOffers(),
    isFav: getRandomBoolean()
  };
}

export { getNewEntry };
