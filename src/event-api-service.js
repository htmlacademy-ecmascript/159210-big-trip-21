import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class EventsApiService extends ApiService {
  #destinations = null;
  #offers = null;

  get events() {
    return this._load({ url: 'points' })
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({ url: 'destinations' })
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({ url: 'offers' })
      .then(ApiService.parseResponse);
  }

  async getDestinations() {
    this.#destinations = await this.destinations;
    return this.#destinations;
  }

  async getOffers() {
    this.#offers = await this.offers;
    return this.#offers;
  }

  async updateEvent(event) {
    const response = await this._load({
      url: `points/${event.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(event)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async addEvent(event) {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(event)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async deleteEvent(event) {
    await this._load({
      url: `points/${event.id}`,
      method: Method.DELETE,
    });
  }

  #adaptToServer(event) {
    const adaptedEvent = {...event,
      ['base_price']: event.basePrice,
      ['date_from']: event.dateFrom instanceof Date ? event.dateFrom.toISOString() : null,
      ['date_to']: event.dateTo instanceof Date ? event.dateTo.toISOString() : null,
      ['is_favorite']: event.isFavorite,
      destination: this.#destinations.find((destination) => destination.name === event.destination)?.id,
      offers: event.offers.map((title) =>
        this.#offers.find((entry) =>
          entry.type === event.type).offers.find((offer) =>
          offer.title === title.title).id),
    };

    delete adaptedEvent.basePrice;
    delete adaptedEvent.dateFrom;
    delete adaptedEvent.dateTo;
    delete adaptedEvent.isFavorite;

    return adaptedEvent;
  }
}
