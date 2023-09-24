import { render } from '../framework/render.js';
import AbstractView from '../framework/view/abstract-view.js';
import EventDestinationView from './event-destination-view.js';
import EventDetailsView from './event-details-view.js';
import EventHeaderView from './event-header-view.js';
import EventOfferView from './event-offer-view.js';

function createPointEditTemplate() {
  return (
    `<form class="event event--edit" action="#" method="post">
    </form>`
  );
}

export default class EventEditView extends AbstractView {
  #header = null;
  #offer = null;
  #destination = null;
  #onSubmitClick = null;
  #onCancelClick = null;
  #event = null;

  #details = new EventDetailsView();

  constructor({ event, onSubmitClick, onCancelClick, onRollupClick }) {
    super();
    this.#header = new EventHeaderView({ event, onRollupClick });
    this.#offer = new EventOfferView(event);
    this.#destination = new EventDestinationView(event);
    this.#onSubmitClick = onSubmitClick;
    this.#onCancelClick = onCancelClick;
    this.#event = event;

    this.element.addEventListener('submit', this.#submitClickHandler);
    this.element.addEventListener('reset', this.#cancelClickHandler);
  }

  get template() {
    return createPointEditTemplate();
  }

  init() {
    render(this.#header, this.element);
    render(this.#details, this.element);
    render(this.#offer, this.#details.element);
    render(this.#destination, this.#details.element);
  }

  #submitClickHandler = (evt) => {
    evt.preventDefault();
    this.#onSubmitClick(this.#event);
  };

  #cancelClickHandler = (evt) => {
    evt.preventDefault();
    this.#onCancelClick();
  };
}
