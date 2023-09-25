import { SortType } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createSortItem({ name, isEnabled, isChecked }) {
  return (`<div class="trip-sort__item  trip-sort__item--${name}">
        <input
          id="sort-${name}"
          class="trip-sort__input  visually-hidden"
          type="radio"
          name="trip-sort"
          value="sort-${name}"
          ${isEnabled ? '' : 'disabled'}
          ${isChecked ? 'checked' : ''}
          data-sort-type="${name}">
        <label
          class="trip-sort__btn"
          for="sort-${name}">${name}</label>
      </div>`);
}

function createSortTemplate() {
  const sortItemsTemplate = Object
    .values(SortType)
    .map(createSortItem)
    .join('');

  return(
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortItemsTemplate}
    </form>`
  );
}

export default class SortView extends AbstractView {
  #onSortTypeChange = null;

  constructor({ onSortTypeChange }) {
    super();
    this.#onSortTypeChange = onSortTypeChange;

    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate();
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.disabled) {
      return;
    }
    evt.preventDefault();
    this.#onSortTypeChange(evt.target.dataset.sortType);
  };
}
