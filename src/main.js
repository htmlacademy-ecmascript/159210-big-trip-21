import { FilterView } from './view/filter-view.js';
import { SortView } from './view/sort-view.js';
import { render } from './render.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');

render(new FilterView(), filtersContainer);
render(new SortView(), tripEvents);
