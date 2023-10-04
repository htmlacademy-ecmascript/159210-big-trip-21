import { DESTINATIONS, EVENT_TYPES, DATE_FORMAT } from '../const.js';
import dayjs from 'dayjs';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

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
  DESTINATIONS.forEach((item) => {
    optionsList += `<option value="${item.name}"></option>`;
  });
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
        <input
          class="event__input  event__input--time"
          id="event-start-time-1"
          type="text"
          name="event-start-time"
          value="${dayjs(startTime).format(DATE_FORMAT.pickerFormat) }">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input
          class="event__input  event__input--time"
          id="event-end-time-1"
          type="text"
          name="event-end-time"
          value="${dayjs(endTime).format(DATE_FORMAT.pickerFormat)}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;${price}
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
    </header>`
  );
}

export default class EventHeaderView extends AbstractStatefulView {
  #onRollupClick = null;
  #datePickerFrom = null;
  #datePickerTo = null;
  #onSubmitClick = null;

  constructor({ event, onRollupClick, onSubmitClick }) {
    super();
    this._setState(EventHeaderView.parseHeaderToState(event));
    this.#onRollupClick = onRollupClick;
    this.#onSubmitClick = onSubmitClick;

    this._restoreHandlers();
  }

  get template() {
    return createEventHeaderTemplate(this._state);
  }

  removeElement() {
    super.removeElement();

    if (this.#datePickerFrom) {
      this.#datePickerFrom.destroy();
      this.#datePickerFrom = null;
    }

    if (this.#datePickerTo) {
      this.#datePickerTo.destroy();
      this.#datePickerTo = null;
    }
  }

  _restoreHandlers() {
    this.element.querySelector('.event__save-btn')
      .addEventListener('click', this.#submitClickHandler);
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupClickHandler);
    this.element.querySelector('.event__type-list')
      .addEventListener('click', this.#eventTypeListHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('input', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('blur', this.#priceChangeHandler);

    this.#setDatePickers();
  }

  #setDatePickers() {
    const [dateFromElement, dateToElement] = this.element.querySelectorAll('.event__input--time');
    const commonConfig = {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      locale: {
        firstDayOfWeek: 1,
      },
      'time_24h': true
    };
    this.#datePickerFrom = flatpickr(
      dateFromElement,
      {
        ...commonConfig,
        defaultDate: dayjs(this._state.startTime).format(DATE_FORMAT.editFormat),
        onClose: this.#dateFromCloseHandler,
        maxDate: Date.parse(this._state.endTime),
      },
    );
    this.#datePickerTo = flatpickr(
      dateToElement,
      {
        ...commonConfig,
        defaultDate: dayjs(this._state.endTime).format(DATE_FORMAT.editFormat),
        onClose: this.#dateToChangeHandler,
        minDate: Date.parse(this._state.startTime),
      },
    );
  }

  #dateFromCloseHandler = ([userDate]) => {
    this._setState({
      ...this._setState,
      startTime: dayjs(userDate).format(DATE_FORMAT.saveFormat),
      date: dayjs(userDate).format(DATE_FORMAT.dateOnlyFormat)
    });
    this.#datePickerTo.set('minDate', this._state.startTime);
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      ...this._setState,
      endTime: dayjs(userDate).format(DATE_FORMAT.saveFormat)
    });
    this.#datePickerFrom.set('maxDate', this._state.endTime);
  };

  #submitClickHandler = (evt) => {
    evt.preventDefault();
    this.#onSubmitClick(this._state);
  };

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
    this.updateElement({
      destination: evt.target.value
    });
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
