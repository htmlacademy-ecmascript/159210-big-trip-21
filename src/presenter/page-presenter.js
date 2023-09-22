import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import { render } from '../framework/render.js';
import { sortByDate } from '../utils/common.js';
import EmptyListView from '../view/empty-list-view.js';
import EventPresenter from './event-presenter.js';

export default class PagePresenter {
  #container = null;
  #sortComponent = null;
  #listComponent = null;
  #eventsModel = null;
  #emptyEventList = null;

  constructor({ container, eventsModel }) {
    this.#container = container;
    this.#sortComponent = new SortView();
    this.#listComponent = new ListView();
    this.#eventsModel = eventsModel;
    this.#emptyEventList = new EmptyListView();
  }

  init() {

    this.events = [...this.#eventsModel.getEvents()];

    this.#renderSort();

    if (this.events.length > 0) {
      this.#renderEventList();
    } else {
      this.#renderEmptyEventList();
    }
  }

  #renderEventList() {
    this.events = sortByDate(this.events);
    render(this.#listComponent, this.#container);

    for (let i = 0; i < this.events.length; i++) {
      this.#renderEvent(this.events[i]);
    }
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter({
      eventListContainer: this.#listComponent.element
    });
    eventPresenter.init(event);
  }

  #renderSort() {
    render(this.#sortComponent, this.#container);
  }

  #renderEmptyEventList() {
    render(this.#emptyEventList, this.#container);
  }
}
