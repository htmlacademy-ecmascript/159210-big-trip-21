import { EditType, Mode, UpdateType, UserAction } from '../const.js';
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

  #editType = EditType.CREATING;
  #mode = Mode.CREATING;

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
      event
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

  setSaving = () => {
    if (this.#mode === Mode.EDITING) {
      this.#eventEditComponent.updateElement({
        isDisabled: true,
        isSaving: true
      });
    }
  };

  setAborting = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#eventEditComponent.shake();
    }

    if (this.#mode === Mode.EDITING) {
      const resetFormState = () => {
        this.#eventEditComponent.updateElement({
          isDisabled: false,
          isSaving: false,
          isDeleting: false
        });
      };

      this.#eventEditComponent.shake(resetFormState);
    }
  };
}
