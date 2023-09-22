import { render, replace } from '../framework/render.js';
import EventEditView from '../view/event-edit-view.js';
import EventLineView from '../view/event-line-view.js';
import ListItemView from '../view/list-item-view.js';


export default class EventPresenter {
  #eventListContainer = null;
  #eventComponent = null;
  #eventEditFormComponent = null;
  #event = null;
  #eventContainerComponent = null;

  constructor({ eventListContainer }) {
    this.#eventListContainer = eventListContainer;
  }

  init(event) {
    this.#event = event;
    this.#eventContainerComponent = new ListItemView();
    this.#eventComponent = new EventLineView({
      event: this.#event,
      onEditClick: this.#onEditClick
    });
    this.#eventEditFormComponent = new EventEditView({
      event: this.#event,
      onSubmitClick: this.#onSubmitClick,
      onCancelClick: this.#onCancelClick,
      onRollupClick: this.#onRollupClick
    });

    this.#eventEditFormComponent.init();

    render(this.#eventContainerComponent, this.#eventListContainer);
    render(this.#eventComponent, this.#eventContainerComponent.element);
  }

  #escKeyDownHandler(evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToLine();
    }
  }

  #onEditClick() {
    this.#replaceLineToForm();
  }

  #onSubmitClick() {
    this.#replaceFormToLine();
  }

  #onCancelClick() {
    this.#replaceFormToLine();
  }

  #onRollupClick() {
    this.#replaceFormToLine();
  }

  #replaceLineToForm() {
    replace(this.#eventEditFormComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToLine() {
    replace(this.#eventComponent, this.#eventEditFormComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }
}
