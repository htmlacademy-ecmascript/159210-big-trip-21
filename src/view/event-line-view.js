import dayjs from 'dayjs';
import { OFFERS, OFFERS_PRICES, DATE_FORMAT, MAX_TIME } from '../const.js';
import { createElement } from '../render.js';

let isDeacreaseNeeded = false;

function createOffersList(offers) {
  let offersList = '';

  offers.forEach((offer) => {
    offersList += `<li class="event__offer">
      <span class="event__offer-title">${OFFERS[offer]}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${OFFERS_PRICES[offer]}</span>
    </li>`;
  });
  return offersList;
}

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

function createEventTemplate({ date, eventType, destination, startTime, price, offers, isFav, endTime}) {
  return (
    `<div class="event">
      <time class="event__date" datetime="2019-03-18">${dayjs(date).format(DATE_FORMAT)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${eventType.toLowerCase()}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${eventType} ${destination}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="2019-03-18T10:30">${dayjs(startTime).format('HH:mm')}</time>
          &mdash;
          <time class="event__end-time" datetime="2019-03-18T11:00">${dayjs(endTime).format('HH:mm')}</time>
        </p>
        <p class="event__duration">${getEventDuration(startTime, endTime)}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${createOffersList(offers)}
      </ul>
      <button class="event__favorite-btn ${isFav ? 'event__favorite-btn--active' : ''}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>`
  );
}

class EventLineView {
  constructor (entry) {
    this.entry = entry;
  }

  getTemplate() {
    return createEventTemplate(this.entry);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  deleteElement() {
    this.element.remove();
  }
}

export { EventLineView };
