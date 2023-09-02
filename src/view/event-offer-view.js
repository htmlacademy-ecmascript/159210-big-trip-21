import { OFFERS, OFFERS_PRICES } from '../const.js';
import { createElement } from '../render.js';

function createOffersList({offers}) {
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

function createOfferTemplate(event) {
  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${createOffersList(event)}
      </div>
    </section>`
  );
}

class EventOfferView {
  constructor (event) {
    this.event = event;
  }

  getTemplate() {
    return createOfferTemplate(this.event);
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

export { EventOfferView };
