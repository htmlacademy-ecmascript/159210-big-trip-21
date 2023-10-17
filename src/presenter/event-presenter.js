import { remove, render, replace } from '../framework/render.js';
import EventEditView from '../view/event-edit-view.js';
import EventLineView from '../view/event-line-view.js';
import ListItemView from '../view/list-item-view.js';
import { Mode, UserAction, UpdateType, EditType } from '../const.js';
import { isSameDate } from '../utils/event.js';


export default class EventPresenter {
  #eventListComponent = null;
  #eventComponent = null;
  #eventEditComponent = null;
  #event = null;
  #onEventChange = null;
  #onModeChange = null;
  #offersModel = null;
  #destinationsModel = null;

  #eventContainerComponent = new ListItemView();
  #mode = Mode.DEFAULT;
  #editType = EditType.EDITING;

  constructor({ eventListComponent, onEventChange, onModeChange, offersModel, destinationsModel }) {
    this.#eventListComponent = eventListComponent;
    this.#onEventChange = onEventChange;
    this.#onModeChange = onModeChange;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init(event) {
    const prevEventComponent = this.#eventComponent;
    const prevEventEditComponent = this.#eventEditComponent;

    this.#event = event;
    this.#eventComponent = new EventLineView({
      event: this.#event,
      onEditClick: this.#onEditClick,
      onFavoriteClick: this.#onFavoriteClick
    });
    this.#eventEditComponent = new EventEditView({
      event: this.#event,
      onSubmitClick: this.#onSubmitClick,
      onDeleteClick: this.#onDeleteClick,
      onRollupClick: this.#onRollupClick,
      editType: this.#editType,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
    });

    this.#eventEditComponent.init();
    if (prevEventComponent === null
      || prevEventEditComponent === null) {

      render(this.#eventContainerComponent, this.#eventListComponent);
      render(this.#eventComponent, this.#eventContainerComponent.element);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventComponent, prevEventComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#eventEditComponent, prevEventEditComponent);
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  destroy () {
    remove(this.#eventContainerComponent);
    remove(this.#eventComponent);
    remove(this.#eventEditComponent);
  }

  resetView () {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToLine();
    }
  }

  #escKeyDownHandler(evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToLine();
    }
  }

  setSaving = () => {
    if (this.#mode === Mode.EDITING) {
      this.#eventEditComponent.updateElement({
        isDisabled: true,
        isSaving: true
      });
    }
  };

  setDeleting = () => {
    this.#eventEditComponent.updateElement({
      isDeleting: true,
      isDisabled: true
    });
  };

  setAborting = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#eventComponent.shake();
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

  #onEditClick = () => {
    this.#replaceLineToForm();
  };

  #onSubmitClick = (update) => {
    const isMinorUpdate =
      !isSameDate(this.#event.dateFrom, update.dateFrom) ||
      !isSameDate(this.#event.dateTo, update.dateTo) ||
      this.#event.basePrice !== update.basePrice;

    this.#onEventChange(
      UserAction.UPDATE_EVENT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update
    );
    this.#replaceFormToLine();
  };

  #onDeleteClick = (event) => {
    this.#onEventChange(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      event
    );
  };

  #onRollupClick = () => {
    this.#replaceFormToLine();
  };

  #onFavoriteClick = () => {
    this.#onEventChange(
      UserAction.UPDATE_EVENT,
      UpdateType.MINOR,
      { ...this.#event, isFavorite: !this.#event.isFavorite }
    );
  };

  #replaceLineToForm() {
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#onModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToLine() {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }
}
