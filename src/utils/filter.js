import { FilterType } from '../const.js';
import { isDateInFuture, isDateToday, isDateInPast } from './event.js';

const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((event) => isDateInFuture(event.dateFrom)),
  [FilterType.PRESENT]: (events) => events.filter((event) => isDateToday(event.dateFrom)),
  [FilterType.PAST]: (events) => events.filter((event) => isDateInPast(event.dateFrom))
};

export { filter };
