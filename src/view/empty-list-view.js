import { DEFAULT_FILTER, SORT_EVENTS } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createEmptyListTemplate(filter = DEFAULT_FILTER) {
  return (
    `<p class="trip-events__msg">
      ${SORT_EVENTS[filter]}
    </p>`
  );
}

export default class EmptyListView extends AbstractView {
  #filter = null;

  constructor (filter) {
    super();
    this.#filter = filter;
  }

  get template() {
    return createEmptyListTemplate(this.#filter);
  }
}
