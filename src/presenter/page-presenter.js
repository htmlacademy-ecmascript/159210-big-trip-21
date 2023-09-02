import { SortView } from '../view/sort-view.js';
import { ListView } from '../view/list-view.js';
import { EventEditView } from '../view/event-edit-view.js';
import { ListItemView } from '../view/list-item-view.js';
import { EventHeaderView } from '../view/event-header-view.js';
import { EventDetailsView } from '../view/event-details-view.js';
import { EventOfferView } from '../view/event-offer-view.js';
import { EventDestinationView } from '../view/event-destination-view.js';
import { render } from '../render.js';
import { sortByDate } from '../utils.js';
import { EmptyListView } from '../view/empty-list-view.js';
import { EventLineView } from '../view/event-line-view.js';

class PagePresenter {
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

      render(this.editingItem, this.listComponent.getElement());
      render(this.editingForm, this.editingItem.getElement());

      render(new EventHeaderView(this.events[0]), this.editingForm.getElement());
      render(this.editingDetails, this.editingForm.getElement());
      render(new EventOfferView(this.events[0]), this.editingDetails.getElement());
      render(new EventDestinationView(this.events[0]), this.editingDetails.getElement());

      for (let i = 1; i < this.events.length; i++) {
        const newItem = new ListItemView();
        render(newItem, this.listComponent.getElement());
        render(new EventLineView(this.events[i]), newItem.getElement());
      }
    } else {
      render(new EmptyListView, this.container);
    }
  }
}

export { PagePresenter };
