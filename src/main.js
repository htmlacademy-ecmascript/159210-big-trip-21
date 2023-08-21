import { FilterView } from './view/filter-view.js';
import { PagePresenter } from './presenter/page-presenter.js';
import { render } from './render.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const content = document.querySelector('.trip-events');

const pagePresenter = new PagePresenter({
  container: content
});

render(new FilterView(), filtersContainer);

pagePresenter.init();

