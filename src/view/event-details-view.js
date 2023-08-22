import { createElement } from '../render.js';

function createDetailsTemplate() {
  return (
    `<section class="event__details">
    </section>`
  );
}

class EventDetailsView {
  getTemplate() {
    return createDetailsTemplate();
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

export { EventDetailsView };
