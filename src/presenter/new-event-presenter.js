import { nanoid } from 'nanoid';
import { EDIT_TYPE, UpdateType, UserAction, EVENT_TYPES, DEFAULT_EVENT } from '../const.js';
import EventEditView from '../view/event-edit-view';
import { RenderPosition, render, remove } from '../framework/render.js';


export default class NewEventPresenter {
  #eventListContainer = null;
  #onDataChange = null;
  #onDestroy = null;
  #eventEditComponent = null;

  #editType = EDIT_TYPE.new.type;
  _eventTypes = EVENT_TYPES;
  #event = DEFAULT_EVENT;

  constructor({ eventListContainer, onDataChange, onDestroy }) {
    this.#eventListContainer = eventListContainer;
    this.#onDataChange = onDataChange;
    this.#onDestroy = onDestroy;
  }

  init() {
    if (this.#eventEditComponent !== null) {
      return;
    }

    this.#eventEditComponent = new EventEditView({
      event: this.#event,
      onSubmitClick: this.#onSubmitClick,
      onDeleteClick: this.#onCancelClick,
      eventTypes: this._eventTypes,
      editType: this.#editType
    });

    render(this.#eventEditComponent, this.#eventListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler(evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
    }
  }

  #onSubmitClick = (event) => {
    this.#onDataChange(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      {id: nanoid(), ...event}
    );
    this.destroy();
  };

  #onCancelClick = () => {
    this.destroy();
  };

  destroy() {
    if (this.#eventEditComponent === null) {
      return;
    }

    this.#onDestroy();

    remove(this.#eventEditComponent);
    this.#eventEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }
}
