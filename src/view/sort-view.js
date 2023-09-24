import { SortType } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createSortTemplate() {
  const sortItems = Object.entries(SortType).map(
    ([, {name, isEnabled, isChecked}]) => ({
      name: name,
      isEnabled: isEnabled,
      isChecked: isChecked
    }),
  );

  const sortItemsTemplate = sortItems.map(({ name, isEnabled, isChecked }) =>
    (`<div class="trip-sort__item  trip-sort__item--${name}">
        <input
          id="sort-${name}"
          class="trip-sort__input  visually-hidden"
          type="radio"
          name="trip-sort"
          value="sort-${name}"
          ${isEnabled ? '' : 'disabled'}
          ${isChecked ? 'checked' : ''}>
        <label
          class="trip-sort__btn"
          for="sort-${name}"
          data-sort-type="${name}">${name}</label>
      </div>`)).join('');

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

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate();
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'LABEL'
      || evt.target.parentNode.querySelector('input').disabled === true) {
      return;
    }
    evt.preventDefault();
    evt.target.parentNode.querySelector('input').checked = true;
    this.#onSortTypeChange(evt.target.dataset.sortType);
  };
}
