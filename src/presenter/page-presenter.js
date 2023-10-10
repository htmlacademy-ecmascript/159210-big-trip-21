import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { sortByDate, sortByDuration, sortByPrice } from '../utils/event.js';
import EmptyListView from '../view/empty-list-view.js';
import EventPresenter from './event-presenter.js';
import { SortType, UpdateType, UserAction, DEFAULT_SORT_TYPE, FilterType, TimeLimit } from '../const.js';
import { filter } from '../utils/filter.js';
import NewEventPresenter from './new-event-presenter.js';
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

export default class PagePresenter {
  #container = null;
  #filterModel = null;
  #eventsModel = null;
  #sortComponent = null;
  #emptyEventList = null;
  #newEventPresenter = null;
  #offersModel = null;
  #destinationsModel = null;

  #listComponent = new ListView();
  #eventPresenters = new Map();
  #currentSortType = DEFAULT_SORT_TYPE;
  #filterType = FilterType.EVERYTHING;
  #loadingComponent = new LoadingView();
  #isLoading = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({ container, filterModel, eventsModel, onNewEventDestroy, offersModel, destinationsModel }) {
    this.#container = container;
    this.#filterModel = filterModel;
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

    this.#eventsModel.addObserver(this.#onModelEvent);
    this.#filterModel.addObserver(this.#onModelEvent);

    this.#newEventPresenter = new NewEventPresenter({
      eventListContainer: this.#listComponent.element,
      onDataChange: this.#onViewAction,
      onDestroy: onNewEventDestroy,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
    });
  }

  get events() {
    this.#filterType = this.#filterModel.filter;
    const events = this.#eventsModel.events;
    const filteredEvents = filter[this.#filterType](events);

    switch (this.#currentSortType) {
      case SortType.DAY.name:
      default:
        return filteredEvents.sort(sortByDate);

      case SortType.TIME.name:
        return filteredEvents.sort(sortByDuration);

      case SortType.PRICE.name:
        return filteredEvents.sort(sortByPrice);
    }
  }

  init() {
    this.#renderPage();
  }

  createEvent() {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newEventPresenter.init();
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #renderPage() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.events.length > 0) {
      this.#renderSort();
      render(this.#listComponent, this.#container);
      this.events.forEach((event) => this.#renderEvent(event));
      return;
    }

    this.#renderEmptyEventList();
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter({
      eventListComponent: this.#listComponent.element,
      onEventChange: this.#onViewAction,
      onModeChange: this.#onModeChange,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
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
    this.#emptyEventList = new EmptyListView(this.#filterType);

    render(this.#emptyEventList, this.#container);
  }

  #clearPage({resetSortType = false} = {}) {

    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#emptyEventList);
    remove(this.#loadingComponent);

    if (resetSortType) {
      this.#currentSortType = DEFAULT_SORT_TYPE;
    }
  }

  #onViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventPresenters.get(update.id).setSaving();
        try {
          await this.#eventsModel.updateEvent(updateType, update);
        } catch (err) {
          throw new Error(err);
          // this.#eventPresenters.get(update.id).setAborting();
        }
        break;

      case UserAction.ADD_EVENT:
        this.#newEventPresenter.setSaving();
        try {
          await this.#eventsModel.addEvent(updateType, update);
        } catch (err) {
          throw new Error(err);
          // this.#newEventPresenter.setAborting();
        }
        break;

      case UserAction.DELETE_EVENT:
        this.#eventPresenters.get(update.id).setDeleting();
        try {
          await this.#eventsModel.deleteEvent(updateType, update);
        } catch (err) {
          throw new Error(err);
          // this.#eventPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
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

      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
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

  #onModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };
}
