import AbstractView from '../framework/view/abstract-view.js';

function createDetailsTemplate() {
  return (
    `<section class="event__details">
    </section>`
  );
}

export default class EventDetailsView extends AbstractView {
  get template() {
    return createDetailsTemplate();
  }
}
