import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { OFFERS, OFFERS_PRICES, DESTINATIONS,
  PHOTOS_BORDER_NUMS, PHOTOS_COUNT, PHOTOS_SRC } from '../const.js';
import { getRandomInteger } from '../utils/common.js';
import EventHeaderView from './event-header-view.js';
import { RenderPosition, render } from '../framework/render.js';

function createOffersList({ offers }) {
  let offersList = '';
  for (const [key, value] of Object.entries(OFFERS)) {
    offersList += `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${key}-1" type="checkbox" name="event-offer-${key}" ${offers.includes(String(key)) ? 'checked' : ''}>
          <label class="event__offer-label" for="event-offer-${key}-1">
            <span class="event__offer-title">${value}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${OFFERS_PRICES[key]}</span>
          </label>
        </div>`;
  }
  return offersList;
}

function createOfferTemplate(event, isOffers) {
  return (
    isOffers ? `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${createOffersList(event)}
      </div>
    </section>` : ''
  );
}

function createPhotos() {
  const count = getRandomInteger(PHOTOS_COUNT.min, PHOTOS_COUNT.max);
  let photos = '';
  for (let i = 0; i < count; i++) {
    photos += `<img class="event__photo" src="${PHOTOS_SRC}${getRandomInteger(PHOTOS_BORDER_NUMS.min, PHOTOS_BORDER_NUMS.max)}" alt="Event photo">\n`;
  }

  return photos;
}

function createDestinationTemplate({ destination, isDestination }) {
  return (
    isDestination ? `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${DESTINATIONS[destination]}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${createPhotos()}
        </div>
      </div>
    </section>` : ''
  );
}

function createEventEditTemplate(event, isOffers, isDestination) {
  return (
    `<form class="event event--edit" action="#" method="post">
      <section class="event__details">
        ${createOfferTemplate(event, isOffers)}
        ${createDestinationTemplate(event, isDestination)}
      </section>
    </form>`
  );
}

export default class EventEditView extends AbstractStatefulView {
  #header = null;
  #onSubmitClick = null;
  #onCancelClick = null;

  constructor({ event, onSubmitClick, onCancelClick, onRollupClick }) {
    super();
    this._setState(EventEditView.parseEventToState(event));
    this.#header = new EventHeaderView({ event, onRollupClick });
    this.#onSubmitClick = onSubmitClick;
    this.#onCancelClick = onCancelClick;

    this._restoreHandlers();
  }

  get template() {
    return createEventEditTemplate(
      this._state,
      this._state.isOffers,
      this._state.isDestination
    );
  }

  _restoreHandlers() {
    this.element.addEventListener('submit', this.#submitClickHandler);
    this.element.addEventListener('reset', this.#cancelClickHandler);
    this.#header.element.querySelector('.event__input--destination')
      .addEventListener('input', this.#destinationChangeHandler);

    this.init();
  }

  init() {
    render(this.#header, this.element, RenderPosition.AFTERBEGIN);
  }

  #submitClickHandler = (evt) => {
    evt.preventDefault();
    this.#onSubmitClick(EventEditView.parseEventToState(this._state));
  };

  #cancelClickHandler = (evt) => {
    evt.preventDefault();
    this.#onCancelClick();
  };

  #destinationChangeHandler = (evt) => {
    if (Object.keys(DESTINATIONS).includes(evt.target.value)) {
      this.updateElement({
        destination: evt.target.value
      });
    }
  };

  static parseEventToState(event) {
    return {
      ...event,
      isDestination: event.destination !== null,
      isOffers: event.offers.length > 0
    };
  }

  static parseStateToEvent(state) {
    const event = { ...state };

    if (!event.isDestination) {
      event.destination = null;
    }

    if (!event.isOffers) {
      event.offers = [];
    }

    delete event.isDestination;
    delete event.isOffers;

    return event;
  }
}
