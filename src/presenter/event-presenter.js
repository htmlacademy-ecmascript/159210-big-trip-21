import { remove, render, replace } from '../framework/render.js';
import EventEditView from '../view/event-edit-view.js';
import EventLineView from '../view/event-line-view.js';
import ListItemView from '../view/list-item-view.js';
import { EVENT_TYPES, Mode, UserAction, UpdateType, EDIT_TYPE } from '../const.js';
import { isSameDate } from '../utils/event.js';


export default class EventPresenter {
  #eventListComponent = null;
  #eventComponent = null;
  #eventEditComponent = null;
  #event = null;
  #onEventChange = null;
  #onModeChange = null;

  #eventContainerComponent = new ListItemView();
  #mode = Mode.DEFAULT;
  _eventTypes = EVENT_TYPES;
  #editType = EDIT_TYPE.edit.type;

  constructor({ eventListComponent, onEventChange, onModeChange }) {
    this.#eventListComponent = eventListComponent;
    this.#onEventChange = onEventChange;
    this.#onModeChange = onModeChange;
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
      eventTypes: this._eventTypes,
      editType: this.#editType,
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

  #onEditClick = () => {
    this.#replaceLineToForm();
  };

  #onSubmitClick = (update) => {
    const isMinorUpdate =
      !isSameDate(this.#event.startTime, update.startTime) ||
      !isSameDate(this.#event.endTime, update.endTime) ||
      this.#event.price !== update.price;

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
      { ...this.#event, isFav: !this.#event.isFav }
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
