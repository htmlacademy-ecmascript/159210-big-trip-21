import { FilterView } from './view/filter-view.js';
import { render } from './render.js';

const filtersContainer = document.querySelector('.trip-controls__filters');

render(new FilterView(), filtersContainer);
