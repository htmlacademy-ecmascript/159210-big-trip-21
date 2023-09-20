import { OFFERS, OFFERS_PRICES } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

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

export default class EventOfferView extends AbstractView {
  #event = null;

  constructor (event) {
    super();
    this.#event = event;
  }

  get template() {
    return createOfferTemplate(this.#event);
  }
}

