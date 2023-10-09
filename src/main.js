import PagePresenter from './presenter/page-presenter.js';
import EventsModel from './model/events-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewEventBtnView from './view/new-event-btn-view.js';
import { render } from './framework/render.js';
import EventsApiService from './event-api-service.js';

const AUTHORIZATION = 'Basic EaK3btfdY7xTFk2Z';
const END_POINT = 'https://21.objects.pages.academy/big-trip';

const filtersContainer = document.querySelector('.trip-controls__filters');
const content = document.querySelector('.trip-events');
const appHeader = document.querySelector('.trip-main');
const filterModel = new FilterModel();

const eventsModel = new EventsModel({
  eventsApiService: new EventsApiService(END_POINT, AUTHORIZATION)
});

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

pagePresenter.init();
filterPresenter.init();
eventsModel.init()
  .finally(() => {
    render(newEventBtnComponent, appHeader);
  });
