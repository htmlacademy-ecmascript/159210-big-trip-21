import { DESTINATIONS, EDIT_DATE_FORMAT, EVENT_TYPES } from '../const.js';
import dayjs from 'dayjs';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

function createEventTypeItems () {
  let itemsList = '';
  EVENT_TYPES.forEach((eventType) => {
    itemsList += `<div class="event__type-item">
              <input
                id="event-type-${eventType.type.toLowerCase()}-1"
                class="event__type-input  visually-hidden"
                type="radio"
                name="event-type"
                value="${eventType.type.toLowerCase()}">
              <label
                class="event__type-label  event__type-label--${eventType.type.toLowerCase()}"
                for="event-type-${eventType.type.toLowerCase()}-1">${eventType.type}</label>
            </div>`;
  });
  return itemsList;
}

function createDestinationOptions() {
  let optionsList = '';
  for (const [key] of Object.entries(DESTINATIONS)) {
    optionsList += `<option value="${key}"></option>`;
  }
  return optionsList;
}

function createEventHeaderTemplate({ typeAndOffers, price, destination, startTime, endTime }) {
  return (
    `<header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${typeAndOffers.type.toLowerCase()}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${createEventTypeItems()}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${typeAndOffers.type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${createDestinationOptions()}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(startTime).format(EDIT_DATE_FORMAT)}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(endTime).format(EDIT_DATE_FORMAT)}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;${price}
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
      <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
    </header>`
  );
}

export default class EventHeaderView extends AbstractStatefulView {
  #onRollupClick = null;

  constructor({ event, onRollupClick }) {
    super();
    this._setState(EventHeaderView.parseHeaderToState(event));
    this.#onRollupClick = onRollupClick;

    this._restoreHandlers();
  }

  get template() {
    return createEventHeaderTemplate(this._state);
  }

  _restoreHandlers() {
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupClickHandler);
    this.element.querySelector('.event__type-list')
      .addEventListener('click', this.#eventTypeListHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('input', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('blur', this.#priceChangeHandler);
  }

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#onRollupClick();
  };

  #eventTypeListHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      typeAndOffers: {
        type: evt.target.innerText,
        offers: []
      }
    });
  };

  #destinationChangeHandler = (evt) => {
    if(Object.keys(DESTINATIONS).includes(evt.target.value)) {
      this.updateElement({
        destination: evt.target.value
      });
    }
  };

  #priceChangeHandler = (evt) => {
    this.updateElement({
      price: evt.target.value
    });
  };

  static parseHeaderToState(event) {
    return {
      ...event
    };
  }
}
