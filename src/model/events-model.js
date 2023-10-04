import { getNewEvent } from '../mock/event.js';
import { ENTRY_COUNT } from '../const.js';
import Observable from '../framework/observable.js';

export default class EventsModel extends Observable {
  #events = Array.from({ length: ENTRY_COUNT }, getNewEvent);

  get events() {
    return this.#events;
  }
}
