import { DEFAULT_FILTER, SORT_EVENTS } from '../const.js';
import { createElement } from '../render.js';

function createEmptyListTemplate(filter = DEFAULT_FILTER) {
  return (
    `<p class="trip-events__msg">
      ${SORT_EVENTS[filter]}
    </p>`
  );
}

class EmptyListView {
  constructor (filter) {
    this.filter = filter;
  }

  getTemplate() {
    return createEmptyListTemplate(this.filter);
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

export { EmptyListView };
