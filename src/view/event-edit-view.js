import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import EventHeaderView from './event-header-view.js';
import { RenderPosition, render } from '../framework/render.js';

function createOffersList(event, allOffers) {
  const eventType = event.type;
  const eventOffers = event.offers;

  const offersOfType = allOffers.find((offer) => offer.type === eventType.toLowerCase()).offers;

  let offersList = '';

  offersOfType.forEach((offer, index) => {
    const isChecked = eventOffers.some((item) => item.title === offer.title);
    offersList += `<div class="event__offer-selector">
          <input
            class="event__offer-checkbox  visually-hidden"
            id="event-offer-${eventType}-${index}"
            type="checkbox"
            name="event-offer-${eventType}-${index}"
            ${isChecked ? 'checked' : ''}>
          <label class="event__offer-label" for="event-offer-${eventType}-${index}">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>`;
  });
  return offersList;
}

function createOfferTemplate(event, isOffers, allOffers) {
  return (
    isOffers ? `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${createOffersList(event, allOffers)}
      </div>
    </section>` : ''
  );
}

function createPhotos(pictures) {
  let photos = '';
  pictures.forEach((photo) => {
    photos += `<img class="event__photo" src="${photo.src}" alt="${photo.description}">\n`;
  });

  return photos;
}

function createDestinationTemplate(destination, isDestination, allDestinations) {
  let currentDestinationInfo;
  if (isDestination) {
    currentDestinationInfo = allDestinations.find((item) => item.name === destination);
  }
  return (
    (isDestination && currentDestinationInfo) ? `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${currentDestinationInfo.description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${createPhotos(currentDestinationInfo.pictures)}
        </div>
      </div>
    </section>` : ''
  );
}

function createEventEditTemplate(event, isOffers, isDestination, allOffers, allDestinations) {
  return (
    `<form class="event event--edit" action="#" method="post">
      <section class="event__details">
        ${createOfferTemplate(event, isOffers, allOffers)}
        ${createDestinationTemplate(event.destination, isDestination, allDestinations)}
      </section>
    </form>`
  );
}

export default class EventEditView extends AbstractStatefulView {
  #header = null;
  #onSubmitClick = null;
  #onDeleteClick = null;
  #allOffers = null;
  #allDestinations = null;

  constructor({ event, onSubmitClick, onDeleteClick, editType, offersModel, destinationsModel, onRollupClick }) {
    super();
    this.#allOffers = offersModel.get();
    this.#allDestinations = destinationsModel.get();
    this._setState(this.parseEventToState(event, this.#allOffers));
    this.#onSubmitClick = onSubmitClick;
    this.#onDeleteClick = onDeleteClick;
    this.#header = new EventHeaderView({
      event,
      onRollupClick,
      onSubmitClick: this.#submitClickHandler,
      editType,
      allDestinations: this.#allDestinations,
      allOffers: this.#allOffers,
    });

    this._restoreHandlers();
  }

  get template() {
    return createEventEditTemplate(
      this._state,
      this._state.isOffers,
      this._state.isDestination,
      this.#allOffers,
      this.#allDestinations,
    );
  }

  _restoreHandlers() {
    this.element.addEventListener('submit', this.#submitClickHandler);
    this.element.addEventListener('reset', this.#deleteClickHandler);
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

  #submitClickHandler = ({ destination, type, date, dateFrom, dateTo, basePrice }) => {
    this.#onSubmitClick(EventEditView.parseStateToEvent({
      ...this._state,
      destination,
      type,
      date,
      dateFrom,
      dateTo,
      basePrice
    }));
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onDeleteClick(EventEditView.parseStateToEvent(this._state));
  };

  #destinationChangeHandler = (evt) => {
    this.updateElement({
      isDestination: evt.target.value !== '',
      destination: evt.target.value
    });
  };

  #eventTypeListHandler = (evt) => {
    this.updateElement({
      type: evt.target.innerText,
      offers: []
    });
  };

  #offersListChangeHandler = (evt) => {
    evt.preventDefault();

    let item = evt.target;

    if (item.nodeName !== 'LABEL' && item.nodeName !== 'SPAN') {
      return;
    }

    do {
      item = item.parentNode;
    } while (item.className !== 'event__offer-selector');

    const itemInput = item.querySelector('input');
    const itemTitle = item.querySelector('.event__offer-title').innerText;
    const isChecked = !itemInput.checked;
    const type = this._state.type;
    const offers = this._state.offers;

    const newOffer = this.#allOffers
      .find((offer) => offer.type === type).offers
      .find((offer) => offer.title === itemTitle);

    if (isChecked) {
      offers.push(newOffer);
    } else {
      const targetIndex = offers.findIndex((offer) => offer.title === itemTitle);
      offers.splice(targetIndex, 1);
    }

    this.updateElement({
      type,
      offers
    });
  };

  parseEventToState(event) {
    const offers = this.#allOffers.find((offer) => offer.type === event.type).offers;

    return {
      ...event,
      isDestination: event.destination !== null,
      isOffers: offers.length > 0 && event
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
