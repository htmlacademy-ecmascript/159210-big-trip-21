import AbstractView from '../framework/view/abstract-view.js';

function createListItemTemplate() {
  return (
    `<li class="trip-events__item">
    </li>`
  );
}

export default class ListItemView extends AbstractView {
  get template() {
    return createListItemTemplate();
  }
}
