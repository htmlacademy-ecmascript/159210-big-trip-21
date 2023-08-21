import { createElement } from '../render.js';

function createPointEditTemplate() {
  return (
    `<form class="event event--edit" action="#" method="post">
    </form>`
  );
}

class EventEditView {
  getTemplate() {
    return createPointEditTemplate();
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

export {EventEditView};
