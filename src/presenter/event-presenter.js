import { remove, render, replace } from '../framework/render.js';
import EventEditView from '../view/event-edit-view.js';
import EventLineView from '../view/event-line-view.js';
import ListItemView from '../view/list-item-view.js';


export default class EventPresenter {
  #eventListComponent = null;
  #eventComponent = null;
  #eventEditComponent = null;
  #event = null;
  #eventContainerComponent = null;

  constructor({ eventListComponent }) {
    this.#eventListComponent = eventListComponent;
  }

  init(event) {
    const prevEventContainerComponent = this.#eventContainerComponent;
    const prevEventComponent = this.#eventComponent;
    const prevEventEditComponent = this.#eventEditComponent;

    this.#event = event;
    this.#eventContainerComponent = new ListItemView();
    this.#eventComponent = new EventLineView({
      event: this.#event,
      onEditClick: this.#onEditClick
    });
    this.#eventEditComponent = new EventEditView({
      event: this.#event,
      onSubmitClick: this.#onSubmitClick,
      onCancelClick: this.#onCancelClick,
      onRollupClick: this.#onRollupClick
    });

    this.#eventEditComponent.init();

    if (prevEventComponent === null
      || prevEventEditComponent === null
      || prevEventContainerComponent === null) {

      render(this.#eventContainerComponent, this.#eventListComponent);
      render(this.#eventComponent, this.#eventContainerComponent.element);
      return;
    }

    if (this.#eventContainerComponent.contains(prevEventComponent.element)) {
      replace(this.#eventComponent, prevEventComponent);
    }

    if (this.#eventContainerComponent.contains(prevEventEditComponent.element)) {
      replace(this.#eventEditComponent, prevEventEditComponent);
    }

    if (this.#eventListComponent.contains(prevEventContainerComponent.element)) {
      replace(this.#eventContainerComponent, prevEventContainerComponent);
    }

    remove(prevEventContainerComponent);
    remove(prevEventComponent);
    remove(prevEventContainerComponent);
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

  #replaceLineToForm() {
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToLine() {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }
}
