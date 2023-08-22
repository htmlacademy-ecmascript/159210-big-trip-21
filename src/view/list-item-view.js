import { createElement } from '../render.js';

function createListItemTemplate() {
  return (
    `<li class="trip-events__item">
    </li>`
  );
}

class ListItemView {
  getTemplate() {
    return createListItemTemplate();
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

export { ListItemView };
