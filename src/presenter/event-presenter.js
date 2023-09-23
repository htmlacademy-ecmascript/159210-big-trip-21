import { remove, render, replace } from '../framework/render.js';
import EventEditView from '../view/event-edit-view.js';
import EventLineView from '../view/event-line-view.js';
import ListItemView from '../view/list-item-view.js';


export default class EventPresenter {
  #eventListComponent = null;
  #eventComponent = null;
  #eventEditComponent = null;
  #event = null;
  #onEventChange = null;

  #eventContainerComponent = new ListItemView();

  constructor({ eventListComponent, onEventChange }) {
    this.#eventListComponent = eventListComponent;
    this.#onEventChange = onEventChange;
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
      onCancelClick: this.#onCancelClick,
      onRollupClick: this.#onRollupClick
    });

    this.#eventEditComponent.init();
    if (prevEventComponent === null
      || prevEventEditComponent === null) {

      render(this.#eventContainerComponent, this.#eventListComponent);
      render(this.#eventComponent, this.#eventContainerComponent.element);
      return;
    }

    if (this.#eventContainerComponent.element.contains(prevEventComponent.element)) {
      replace(this.#eventComponent, prevEventComponent);
    }

    if (this.#eventContainerComponent.element.contains(prevEventEditComponent.element)) {
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

  #escKeyDownHandler(evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToLine();
    }
  }

  #onEditClick = () => {
    this.#replaceLineToForm();
  };

  #onSubmitClick = () => {
    this.#replaceFormToLine();
  };

  #onCancelClick = () => {
    this.#replaceFormToLine();
  };

  #onRollupClick = () => {
    this.#replaceFormToLine();
  };

  #onFavoriteClick = () => {
    this.#onEventChange({ ...this.#event, isFav: !this.#event.isFav });
  };

  #replaceLineToForm() {
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToLine() {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }
}
