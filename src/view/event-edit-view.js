import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { OFFERS_KEY_WORDS, DESTINATIONS,
  PHOTOS_SRC, } from '../const.js';
import EventHeaderView from './event-header-view.js';
import { RenderPosition, render } from '../framework/render.js';

function createOffersList(event, eventTypes) {
  const eventType = event.typeAndOffers.type;
  const eventOffers = event.typeAndOffers.offers;
  const offersofType = eventTypes.filter((item) =>
    item.type === eventType)[0].offers;
  let offersList = '';
  offersofType.forEach((offer) => {
    const keyWord = OFFERS_KEY_WORDS.filter((word) => offer.title.includes(word));
    const isChecked = eventOffers.some((item) => item.title.includes(keyWord));
    offersList += `<div class="event__offer-selector">
          <input
            class="event__offer-checkbox  visually-hidden"
            id="event-offer-${keyWord}-1"
            type="checkbox"
            name="event-offer-${keyWord}"
            ${isChecked ? 'checked' : ''}>
          <label class="event__offer-label" for="event-offer-${keyWord}-1">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>`;
  });
  return offersList;
}

function createOfferTemplate(event, isOffers, eventTypes) {
  return (
    isOffers ? `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${createOffersList(event, eventTypes)}
      </div>
    </section>` : ''
  );
}

function createPhotos(destination) {
  let photos = '';
  const destinationPhotos = DESTINATIONS[destination].photos;
  destinationPhotos.forEach((photo) => {
    photos += `<img class="event__photo" src="${PHOTOS_SRC}${photo}" alt="Event photo">\n`;
  });

  return photos;
}

function createDestinationTemplate({ destination, isDestination }) {
  return (
    isDestination ? `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${DESTINATIONS[destination].description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${createPhotos(destination)}
        </div>
      </div>
    </section>` : ''
  );
}

function createEventEditTemplate(event, isOffers, isDestination, eventTypes) {
  return (
    `<form class="event event--edit" action="#" method="post">
      <section class="event__details">
        ${createOfferTemplate(event, isOffers, eventTypes)}
        ${createDestinationTemplate(event, isDestination)}
      </section>
    </form>`
  );
}

export default class EventEditView extends AbstractStatefulView {
  #header = null;
  #onSubmitClick = null;
  #onCancelClick = null;

  constructor({ event, onSubmitClick, onCancelClick, onRollupClick, eventTypes }) {
    super();
    this._eventTypes = eventTypes;
    this._setState(this.parseEventToState(event));
    this.#header = new EventHeaderView({ event, onRollupClick });
    this.#onSubmitClick = onSubmitClick;
    this.#onCancelClick = onCancelClick;
    this._restoreHandlers();
  }

  get template() {
    return createEventEditTemplate(
      this._state,
      this._state.isOffers,
      this._state.isDestination,
      this._eventTypes
    );
  }

  _restoreHandlers() {
    this.element.addEventListener('submit', this.#submitClickHandler);
    this.element.addEventListener('reset', this.#cancelClickHandler);
    this.#header.element.querySelector('.event__input--destination')
      .addEventListener('input', this.#destinationChangeHandler);
    this.#header.element.querySelector('.event__type-list')
      .addEventListener('click', this.#eventTypeListHandler);

    if (this.element.querySelector('.event__available-offers')) {
      this.element.querySelector('.event__available-offers')
        .addEventListener('click', this.#offersListChangeHandler);
    }

    this.init();
  }

  init() {
    render(this.#header, this.element, RenderPosition.AFTERBEGIN);
  }

  #submitClickHandler = (evt) => {
    evt.preventDefault();
    this.#onSubmitClick(EventEditView.parseStateToEvent(this._state));
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

  #eventTypeListHandler = (evt) => {
    this.updateElement({
      typeAndOffers: {
        type: evt.target.innerText,
        offers: []
      }
    });
  };

  #offersListChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    const target = evt.target.name.replace('event-offer-', '');
    const isChecked = evt.target.checked;
    const type = this._state.typeAndOffers.type;
    const offers = this._state.typeAndOffers.offers;
    if (isChecked) {
      offers.push(target);
    } else {
      offers.splice(offers.indexOf(target), 1);
    }
    this.updateElement({
      typeAndOffers: {
        type,
        offers
      }
    });
  };

  parseEventToState(event) {
    const type = event.typeAndOffers.type;
    return {
      ...event,
      isDestination: event.destination !== null,
      isOffers: this._eventTypes.filter((item) =>
        item.type === type)[0].offers.length > 0
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
