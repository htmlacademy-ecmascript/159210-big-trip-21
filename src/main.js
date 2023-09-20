import FilterView from './view/filter-view.js';
import PagePresenter from './presenter/page-presenter.js';
import { render } from './framework/render.js';
import { EventsModel } from './model/events-model.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const content = document.querySelector('.trip-events');
const eventsModel = new EventsModel();

const pagePresenter = new PagePresenter({
  container: content,
  eventsModel
});

render(new FilterView(), filtersContainer);

pagePresenter.init();

