import { getNewEvent } from '../mock/event.js';
import { ENTRY_COUNT } from '../const.js';

export default class EventsModel {
  #events = Array.from({ length: ENTRY_COUNT }, getNewEvent);

  get events() {
    return this.#events;
  }
}
