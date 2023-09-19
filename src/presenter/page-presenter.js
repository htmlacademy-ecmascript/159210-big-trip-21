import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import EventEditView from '../view/event-edit-view.js';
import ListItemView from '../view/list-item-view.js';
import EventHeaderView from '../view/event-header-view.js';
import EventDetailsView from '../view/event-details-view.js';
import EventOfferView from '../view/event-offer-view.js';
import EventDestinationView from '../view/event-destination-view.js';
import { render } from '../framework/render.js';
import { sortByDate } from '../utils.js';
import EmptyListView from '../view/empty-list-view.js';
import EventLineView from '../view/event-line-view.js';

export default class PagePresenter {
  constructor ({container, eventsModel}) {
    this.container = container;
    this.sortComponent = new SortView();
    this.listComponent = new ListView();
    this.editingItem = new ListItemView();
    this.editingForm = new EventEditView();
    this.editingDetails = new EventDetailsView();
    this.eventsModel = eventsModel;
  }

  init() {

    this.events = [...this.eventsModel.getEvents()];

    if (this.events.length > 0) {
      this.events = sortByDate(this.events);
      render(this.sortComponent, this.container);
      render(this.listComponent, this.container);

      render(this.editingItem, this.listComponent.element);
      render(this.editingForm, this.editingItem.element);

      render(new EventHeaderView(this.events[0]), this.editingForm.element);
      render(this.editingDetails, this.editingForm.element);
      render(new EventOfferView(this.events[0]), this.editingDetails.element);
      render(new EventDestinationView(this.events[0]), this.editingDetails.element);

      for (let i = 1; i < this.events.length; i++) {
        const newItem = new ListItemView();
        render(newItem, this.listComponent.element);
        render(new EventLineView(this.events[i]), newItem.element);
      }
    } else {
      render(new EmptyListView, this.container);
    }
  }
}
