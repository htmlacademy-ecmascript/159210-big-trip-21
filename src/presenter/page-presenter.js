import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import { render } from '../framework/render.js';
import { sortByDate, sortByDuration, sortByPrice } from '../utils/event.js';
import EmptyListView from '../view/empty-list-view.js';
import EventPresenter from './event-presenter.js';
import { SortType } from '../const.js';

export default class PagePresenter {
  #container = null;
  #eventsModel = null;
  #sortComponent = null;

  #listComponent = new ListView();
  #emptyEventList = new EmptyListView();
  #eventPresenters = new Map();
  #currentSortType = this.#getCurrentSortType(SortType);

  constructor({ container, eventsModel }) {
    this.#container = container;
    this.#eventsModel = eventsModel;
  }

  get events() {
    switch (this.#currentSortType) {
      case SortType.DAY.name:
        return [...this.#eventsModel.events].sort(sortByDate);

      case SortType.TIME.name:
        return [...this.#eventsModel.events].sort(sortByDuration);

      case SortType.PRICE.name:
      default:
        return [...this.#eventsModel.events].sort(sortByPrice);
    }
  }

  init() {

    this.#renderSort();

    if (this.events.length > 0) {
      this.#renderEventList();
    } else {
      this.#renderEmptyEventList();
    }
  }

  #renderEventList() {

    render(this.#listComponent, this.#container);

    for (let i = 0; i < this.events.length; i++) {
      this.#renderEvent(this.events[i]);
    }
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter({
      eventListComponent: this.#listComponent.element,
      onEventChange: this.#onEventChange,
      onModeChange: this.#onModeChange
    });
    eventPresenter.init(event);
    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#onSortTypeChange
    });
    render(this.#sortComponent, this.#container);
  }

  #renderEmptyEventList() {
    render(this.#emptyEventList, this.#container);
  }

  #getCurrentSortType(types) {
    return Object
      .values(types)
      .find(({ isChecked }) => isChecked)?.name;
  }

  #clearEventList() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
  }

  #onSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearEventList();
    this.#renderEventList();
  };

  #onEventChange = (updatedEvent) => {
    this.#eventPresenters.get(updatedEvent.id).init(updatedEvent);
  };

  #onModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };
}
