import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import { render, remove } from '../framework/render.js';
import { sortByDate, sortByDuration, sortByPrice } from '../utils/event.js';
import EmptyListView from '../view/empty-list-view.js';
import EventPresenter from './event-presenter.js';
import { SortType, UpdateType, UserAction, DEFAULT_SORT_TYPE } from '../const.js';
import { filter } from '../utils/filter.js';

export default class PagePresenter {
  #container = null;
  #filterModel = null;
  #eventsModel = null;
  #sortComponent = null;

  #listComponent = new ListView();
  #emptyEventList = new EmptyListView();
  #eventPresenters = new Map();
  #currentSortType = DEFAULT_SORT_TYPE;

  constructor({ container, filterModel, eventsModel }) {
    this.#container = container;
    this.#filterModel = filterModel;
    this.#eventsModel = eventsModel;

    this.#eventsModel.addObserver(this.#onModelEvent);
    this.#filterModel.addObserver(this.#onModelEvent);
  }

  get events() {
    const filterType = this.#filterModel.filter;
    const events = this.#eventsModel.events;
    const filteredEvents = filter[filterType](events);

    switch (this.#currentSortType) {
      case SortType.DAY.name:
        return filteredEvents.sort(sortByDate);

      case SortType.TIME.name:
        return filteredEvents.sort(sortByDuration);

      case SortType.PRICE.name:
      default:
        return filteredEvents.sort(sortByPrice);
    }
  }

  init() {
    this.#renderPage();
  }

  #renderPage() {
    this.#renderSort();
    render(this.#listComponent, this.#container);

    if (this.events.length > 0) {
      for (let i = 0; i < this.events.length; i++) {
        this.#renderEvent(this.events[i]);
      }
    } else {
      this.#renderEmptyEventList();
    }
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter({
      eventListComponent: this.#listComponent.element,
      onEventChange: this.#onViewAction,
      onModeChange: this.#onModeChange
    });
    eventPresenter.init(event);
    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#onSortTypeChange
    });
    render(this.#sortComponent, this.#container);
  }

  #renderEmptyEventList() {
    render(this.#emptyEventList, this.#container);
  }

  #clearPage({resetSortType = false} = {}) {

    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#emptyEventList);

    if (resetSortType) {
      this.#currentSortType = DEFAULT_SORT_TYPE;
    }
  }

  #onViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventsModel.updateEvent(updateType,update);
        break;

      case UserAction.ADD_EVENT:
        this.#eventsModel.addEvent(updateType, update);
        break;

      case UserAction.DELETE_EVENT:
        this.#eventsModel.deleteEvent(updateType, update);
        break;
    }
  };

  #onModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#eventPresenters.get(data.id).init(data);
        break;

      case UpdateType.MINOR:
        this.#clearPage();
        this.#renderPage();
        break;

      case UpdateType.MAJOR:
        this.#clearPage({resetSortType: true});
        this.#renderPage();
        break;
    }
  };

  #onSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPage();
    this.#renderPage();
  };

  #onEventChange = (updatedEvent) => {
    this.#eventPresenters.get(updatedEvent.id).init(updatedEvent);
  };

  #onModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };
}
