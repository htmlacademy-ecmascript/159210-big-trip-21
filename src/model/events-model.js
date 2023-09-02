import { getNewEntry } from '../mock/event.js';
import { ENTRY_COUNT } from '../const.js';

class EventsModel {
  events = Array.from({length: ENTRY_COUNT}, getNewEntry);

  getEvents() {
    return this.events;
  }
}

export { EventsModel };
