import FilterView from './view/filter-view.js';
import PagePresenter from './presenter/page-presenter.js';
import { render } from './framework/render.js';
import { EventsModel } from './model/events-model.js';
import { generateFilter } from './mock/filter.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const content = document.querySelector('.trip-events');
const eventsModel = new EventsModel();

const pagePresenter = new PagePresenter({
  container: content,
  eventsModel
});

const filters = generateFilter(eventsModel.events);
render(new FilterView({filters}), filtersContainer);

pagePresenter.init();

