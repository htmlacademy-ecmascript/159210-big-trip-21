import { DESTINATIONS, EDIT_DATE_FORMAT, EVENT_TYPES } from '../const.js';
import { createElement } from '../render.js';
import dayjs from 'dayjs';

function createEventTypeItems () {
  let itemsList = '';
  EVENT_TYPES.forEach((eventType) => {
    itemsList += `<div class="event__type-item">
              <input id="event-type-${eventType.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType.toLowerCase()}">
              <label class="event__type-label  event__type-label--${eventType.toLowerCase()}" for="event-type-${eventType.toLowerCase()}-1">${eventType}</label>
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

function createEventHeaderTemplate({ eventType, price, destination, startTime, endTime }) {
  return (
    `<header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${eventType.toLowerCase()}.png" alt="Event type icon">
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
          ${eventType}
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
    </header>`
  );
}

class EventHeaderView {
  constructor(event) {
    this.event = event.entry;
  }

  getTemplate() {
    return createEventHeaderTemplate(this.event);
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

export { EventHeaderView };
