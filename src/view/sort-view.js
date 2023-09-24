import { SortType } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createSortItem(name, isEnabled, isChecked) {
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
        <label class="trip-sort__btn" for="sort-${name}">${name}</label>
      </div>`);
}

function createSortTemplate() {
  const sortItems = Object.entries(SortType).map(
    ([, {name, isEnabled, isChecked}]) => ({
      name: name,
      isEnabled: isEnabled,
      isChecked: isChecked
    }),
  );

  const sortItemsTemplate = sortItems.map(({ name, isEnabled, isChecked }) =>
    createSortItem(name, isEnabled, isChecked)).join('');

  return(
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortItemsTemplate}
    </form>`
  );
}

export default class SortView extends AbstractView {
  get template() {
    return createSortTemplate();
  }
}
