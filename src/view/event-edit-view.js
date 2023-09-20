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
  #details = null;
  #offer = null;
  #destination = null;

  constructor({ event, onSubmitClick, onCancelClick, onRollupClick }) {
    super();
    this.#header = new EventHeaderView({ event, onSubmitClick, onCancelClick, onRollupClick });
    this.#details = new EventDetailsView();
    this.#offer = new EventOfferView(event);
    this.#destination = new EventDestinationView(event);
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
}
