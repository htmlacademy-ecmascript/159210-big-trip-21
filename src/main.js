import { FilterView } from './view/filter-view.js';
import { SortView } from './view/sort-view.js';
import { ListView } from './view/list-view.js';
import { ListItemView } from './view/list-item-view.js';
import { render } from './render.js';

const ENTRY_COUNT = 3;

const filtersContainer = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');

render(new FilterView(), filtersContainer);
render(new SortView(), tripEvents);
render(new ListView(), tripEvents);

const eventsList = tripEvents.querySelector('.trip-events__list');

for (let i = 0; i < ENTRY_COUNT; i++) {
  render(new ListItemView(), eventsList);
}
