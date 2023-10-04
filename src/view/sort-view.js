import { SortType } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createSortItem(currentSortType, { name, isEnabled }) {
  return (`<div class="trip-sort__item  trip-sort__item--${name}">
        <input
          id="sort-${name}"
          class="trip-sort__input  visually-hidden"
          type="radio"
          name="trip-sort"
          value="sort-${name}"
          ${isEnabled ? '' : 'disabled'}
          ${name === currentSortType ? 'checked' : ''}
          data-sort-type="${name}">
        <label
          class="trip-sort__btn"
          for="sort-${name}">${name}</label>
      </div>`);
}

function createSortTemplate(currentSortType) {
  const sortItemsTemplate = Object
    .values(SortType)
    .map(({ name, isEnabled }) =>
      createSortItem(currentSortType, { name, isEnabled }))
    .join('');

  return(
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortItemsTemplate}
    </form>`
  );
}

export default class SortView extends AbstractView {
  #onSortTypeChange = null;
  #currentSortType = null;

  constructor({ currentSortType, onSortTypeChange }) {
    super();
    this.#onSortTypeChange = onSortTypeChange;
    this.#currentSortType = currentSortType;

    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.disabled) {
      return;
    }
    evt.preventDefault();
    this.#onSortTypeChange(evt.target.dataset.sortType);
  };
}
