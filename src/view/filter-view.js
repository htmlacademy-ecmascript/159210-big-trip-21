import AbstractView from '../framework/view/abstract-view';

function createFilterItem(filter, isChecked) {
  const {type, count} = filter;

  return (`<div class="trip-filters__filter">
        <input
          id="filter-${type.toLowerCase()}"
          class="trip-filters__filter-input  visually-hidden"
          type="radio"
          name="trip-filter"
          value="${type.toLowerCase()}"
          ${isChecked ? 'checked' : ''}
          ${count === 0 ? 'disabled' : ''}>
        <label
          class="trip-filters__filter-label"
          for="filter-${type.toLowerCase()}">${type}</label>
      </div>`);
}

function createFilterTemplate(filterItems) {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItem(filter, index === 0))
    .join('');

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterItemsTemplate}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`);
}

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #onFilterTypeChange = null;

  constructor({ filters, currentFilter, onFilterTypeChange }) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilter;
    this.#onFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#onFilterTypeChange(evt.target.value);
  };
}
