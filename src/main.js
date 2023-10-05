import PagePresenter from './presenter/page-presenter.js';
import EventsModel from './model/events-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewEventBtnView from './view/new-event-btn-view.js';
import { render } from './framework/render.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const content = document.querySelector('.trip-events');
const appHeader = document.querySelector('.trip-main');
const eventsModel = new EventsModel();
const filterModel = new FilterModel();

const pagePresenter = new PagePresenter({
  container: content,
  filterModel,
  eventsModel,
  onNewEventDestroy: onNewEventFormClose
});

const filterPresenter = new FilterPresenter({
  filterContainer: filtersContainer,
  filterModel,
  eventsModel
});

const newEventBtnComponent = new NewEventBtnView({
  onClick: onNewEventBtnClick
});

function onNewEventFormClose() {
  newEventBtnComponent.element.disabled = false;
}

function onNewEventBtnClick() {
  pagePresenter.createEvent();
  newEventBtnComponent.element.disabled = true;
}

render(newEventBtnComponent, appHeader);

pagePresenter.init();
filterPresenter.init();
