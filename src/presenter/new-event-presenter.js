import { nanoid } from 'nanoid';
import { EDIT_TYPE, UpdateType, UserAction } from '../const.js';
import EventEditView from '../view/event-edit-view';
import { RenderPosition, render, remove } from '../framework/render.js';

function getDefaultEvent(offersModel) {
  const types = offersModel.get();
  return {
    type: types[0].type,
    offers: [],
    destination: null,
    dateFrom: new Date(),
    dateTo: new Date(),
    basePrice: 0,
    isFavorite: false
  };
}

export default class NewEventPresenter {
  #eventListContainer = null;
  #onDataChange = null;
  #onDestroy = null;
  #eventEditComponent = null;
  #offersModel = null;
  #destinationsModel = null;
  #event = null;

  #editType = EDIT_TYPE.new.type;

  constructor({ eventListContainer, onDataChange, onDestroy, offersModel, destinationsModel }) {
    this.#eventListContainer = eventListContainer;
    this.#onDataChange = onDataChange;
    this.#onDestroy = onDestroy;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    if (this.#eventEditComponent !== null) {
      return;
    }

    this.#event = getDefaultEvent(this.#offersModel);

    this.#eventEditComponent = new EventEditView({
      event: this.#event,
      onSubmitClick: this.#onSubmitClick,
      onDeleteClick: this.#onCancelClick,
      editType: this.#editType,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
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
