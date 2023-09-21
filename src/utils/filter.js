import { FilterType } from '../const.js';
import { isEventInFuture, isEventToday, isEventInPast } from './event.js';

const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((event) => isEventInFuture(event.date)),
  [FilterType.PRESENT]: (events) => events.filter((event) => isEventToday(event.date)),
  [FilterType.PAST]: (events) => events.filter((event) => isEventInPast(event.date))
};

export { filter };
