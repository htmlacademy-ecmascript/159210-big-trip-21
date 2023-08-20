import { FilterView } from './view/filter-view.js';
import { SortView } from './view/sort-view.js';
import { ListView } from './view/list-view.js';
import { ListItemView } from './view/list-item-view.js';
import { PointEditView } from './view/point-edit-view.js';
import { OfferView} from './view/offer-view.js';
import { render, RenderPosition } from './render.js';

const ENTRY_COUNT = 3;
const CHANGING_ENTRY = 0;

const filtersContainer = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');

render(new FilterView(), filtersContainer);
render(new SortView(), tripEvents);
render(new ListView(), tripEvents);

const eventsList = tripEvents.querySelector('.trip-events__list');

for (let i = 0; i < ENTRY_COUNT; i++) {
  render(new ListItemView(), eventsList);
}
const changingEventItem = eventsList.querySelectorAll('.trip-events__item')[CHANGING_ENTRY];

render(new PointEditView(), changingEventItem, RenderPosition.AFTERBEGIN);

const eventsDetails = eventsList.querySelector('.event__details');

render(new OfferView(), eventsDetails);
