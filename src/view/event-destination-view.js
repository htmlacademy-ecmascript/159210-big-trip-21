import { DESTINATIONS, PHOTOS_BORDER_NUMS, PHOTOS_COUNT, PHOTOS_SRC } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';
import { getRandomInteger } from '../utils/common.js';

function createPhotos() {
  const count = getRandomInteger(PHOTOS_COUNT.min, PHOTOS_COUNT.max);
  let photos = '';
  for (let i = 0; i < count; i++) {
    photos += `<img class="event__photo" src="${PHOTOS_SRC}${getRandomInteger(PHOTOS_BORDER_NUMS.min, PHOTOS_BORDER_NUMS.max)}" alt="Event photo">\n`;
  }

  return photos;
}

function createDestinationTemplate({ destination }) {
  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${DESTINATIONS[destination]}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${createPhotos()}
        </div>
      </div>
    </section>`
  );
}

export default class EventDestinationView extends AbstractView {
  #event = null;

  constructor (event) {
    super();
    this.#event = event;
  }

  get template() {
    return createDestinationTemplate(this.#event);
  }
}
