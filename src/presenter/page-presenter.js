import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import EventEditView from '../view/event-edit-view.js';
import ListItemView from '../view/list-item-view.js';
import { render, replace } from '../framework/render.js';
import { sortByDate } from '../utils.js';
import EmptyListView from '../view/empty-list-view.js';
import EventLineView from '../view/event-line-view.js';

export default class PagePresenter {
  #container = null;
  #sortComponent = null;
  #listComponent = null;
  #eventsModel = null;

  constructor ({container, eventsModel}) {
    this.#container = container;
    this.#sortComponent = new SortView();
    this.#listComponent = new ListView();
    this.#eventsModel = eventsModel;
  }

  init() {

    this.events = [...this.#eventsModel.getEvents()];

    if (this.events.length > 0) {
      this.events = sortByDate(this.events);
      render(this.#sortComponent, this.#container);
      render(this.#listComponent, this.#container);

      for (let i = 0; i < this.events.length; i++) {
        this.#renderEvent(this.events[i]);
      }
    } else {
      render(new EmptyListView, this.#container);
    }
  }

  #renderEvent(event) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToLine();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const eventContainerComponent = new ListItemView();
    const eventComponent = new EventLineView({
      event,
      onEditClick: () => {
        replaceLineToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const eventEditFormComponent = new EventEditView({
      event,
      onSubmitClick: () => {
        replaceFormToLine();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onCancelClick: () => {
        replaceFormToLine();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onRollupClick: () => {
        replaceFormToLine();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });
    eventEditFormComponent.init();

    function replaceLineToForm() {
      replace(eventEditFormComponent, eventComponent);
      eventEditFormComponent.init();
    }

    function replaceFormToLine() {
      replace(eventComponent, eventEditFormComponent);
    }

    render(eventContainerComponent, this.#listComponent.element);
    render(eventComponent, eventContainerComponent.element);
  }
}
