import { FilterType, UpdateType } from '../const.js';
import { remove, render, replace } from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import { filter } from '../utils/filter.js';


export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #eventsModel = null;
  #filterComponent = null;

  constructor({ filterContainer, filterModel, eventsModel }) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#eventsModel = eventsModel;

    this.#eventsModel.addObserver(this.#onModelEvent);
    this.#filterModel.addObserver(this.#onModelEvent);
  }

  get filters() {
    const events = this.#eventsModel.events;

    return [
      {
        type: FilterType.EVERYTHING,
        name: 'Everything',
        count: filter[FilterType.EVERYTHING](events).length
      }, {
        type: FilterType.FUTURE,
        name: 'Future',
        count: filter[FilterType.FUTURE](events).length
      }, {
        type: FilterType.PRESENT,
        name: 'Present',
        count: filter[FilterType.PRESENT](events).length
      }, {
        type: FilterType.PAST,
        name: 'Past',
        count: filter[FilterType.PAST](events).length
      }
    ];
  }

  init() {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters,
      currentFilter: this.#filterModel.filter,
      onFilterTypeChange: this.#onFilterTypeChange
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #onModelEvent = () => {
    this.init();
  };

  #onFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
