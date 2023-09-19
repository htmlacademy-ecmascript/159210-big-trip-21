import AbstractView from '../framework/view/abstract-view.js';

function createPointEditTemplate() {
  return (
    `<form class="event event--edit" action="#" method="post">
    </form>`
  );
}

export default class EventEditView extends AbstractView {
  get template() {
    return createPointEditTemplate();
  }
}
