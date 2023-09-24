import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import { render } from '../framework/render.js';
import { sortByDate } from '../utils/common.js';
import EmptyListView from '../view/empty-list-view.js';
import EventPresenter from './event-presenter.js';
import { updateEvent } from '../utils/event.js';

export default class PagePresenter {
  #container = null;
  #eventsModel = null;

  #events = [];
  #sortComponent = new SortView();
  #listComponent = new ListView();
  #emptyEventList = new EmptyListView();
  #eventPresenters = new Map();

  constructor({ container, eventsModel }) {
    this.#container = container;
    this.#eventsModel = eventsModel;
  }

  init() {

    this.#events = [...this.#eventsModel.events];

    this.#renderSort();

    if (this.#events.length > 0) {
      this.#renderEventList();
    } else {
      this.#renderEmptyEventList();
    }
  }

  #renderEventList() {
    this.#events = sortByDate(this.#events);
    render(this.#listComponent, this.#container);

    for (let i = 0; i < this.#events.length; i++) {
      this.#renderEvent(this.#events[i]);
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
    render(this.#sortComponent, this.#container);
  }

  #renderEmptyEventList() {
    render(this.#emptyEventList, this.#container);
  }

  #onEventChange = (updatedEvent) => {
    this.#events = updateEvent(this.#events, updatedEvent);
    this.#eventPresenters.get(updatedEvent.id).init(updatedEvent);
  };

  #onModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };
}
