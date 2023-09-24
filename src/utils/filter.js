import { FilterType } from '../const.js';
import { isDateInFuture, isDateToday, isDateInPast } from './event.js';

const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((event) => isDateInFuture(event.date)),
  [FilterType.PRESENT]: (events) => events.filter((event) => isDateToday(event.date)),
  [FilterType.PAST]: (events) => events.filter((event) => isDateInPast(event.date))
};

export { filter };
