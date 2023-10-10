import { UpdateType } from '../const.js';
import Observable from '../framework/observable.js';
import { humanizeOffers } from '../utils/event.js';

export default class EventsModel extends Observable {
  #eventsApiService = null;
  #destinationsModel = null;
  #offersModel = null;

  #events = [];

  constructor({ eventsApiService, destinationsModel, offersModel }) {
    super();
    this.#eventsApiService = eventsApiService;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  get events() {
    return this.#events;
  }

  async init() {
    try {
      await this.#destinationsModel.init();
      await this.#offersModel.init();

      const events = await this.#eventsApiService.events;

      this.#events = events.map(this.#adaptToClient.bind(this));
    } catch(err) {
      this.#events = [];
    }

    this._notify(UpdateType.INIT);
  }

  async updateEvent(updateType, update) {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting event');
    }

    try {
      const response = await this.#eventsApiService.updateEvent(update);
      const updatedEvent = this.#adaptToClient(response);

      this.#events = [
        ...this.#events.slice(0, index),
        updatedEvent,
        ...this.#events.slice(index + 1),
      ];

      this._notify(updateType, updatedEvent);
    } catch(err) {
      throw new Error('Can\'t update event');
    }
  }

  async addEvent(updateType, update) {
    try {
      const response = await this.#eventsApiService.addEvent(update);
      const updatedEvent = this.#adaptToClient(response);

      this.#events = [
        updatedEvent,
        ...this.#events,
      ];

      this._notify(updateType, updatedEvent);
    } catch (err) {
      throw new Error('Can\'t add event');
    }
  }

  async deleteEvent(updateType, update) {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting event');
    }

    try {
      await this.#eventsApiService.deleteEvent(update);

      this.#events = [
        ...this.#events.slice(0, index),
        ...this.#events.slice(index + 1),
      ];

      this._notify(updateType);
    } catch (err) {
      throw new Error('Can\'t delete event');
    }
  }

  #adaptToClient(event) {
    const adaptedEvent = {...event,
      basePrice: event['base_price'],
      dateFrom: event['date_from'] !== null ? new Date(event['date_from']) : event['date_from'],
      dateTo: event['date_to'] !== null ? new Date(event['date_to']) : event['date_to'],
      isFavorite: event['is_favorite'],
      destination: this.#destinationsModel.getById(event.destination).name,
      offers: event.offers.map((offer) => humanizeOffers(offer, event, this.#offersModel)),
    };

    delete adaptedEvent['base_price'];
    delete adaptedEvent['date_from'];
    delete adaptedEvent['date_to'];
    delete adaptedEvent['is_favorite'];

    return adaptedEvent;
  }
}
