import PagePresenter from './presenter/page-presenter.js';
import EventsModel from './model/events-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const content = document.querySelector('.trip-events');
const eventsModel = new EventsModel();
const filterModel = new FilterModel();

const pagePresenter = new PagePresenter({
  container: content,
  filterModel,
  eventsModel
});

const filterPresenter = new FilterPresenter({
  filterContainer: filtersContainer,
  filterModel,
  eventsModel
});

pagePresenter.init();
filterPresenter.init();
