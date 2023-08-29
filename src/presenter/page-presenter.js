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
import { getArrayOfEvents } from '../mock/event.js';

let eventsArray = getArrayOfEvents();

class PagePresenter {
  constructor ({container}) {
    this.container = container;
    this.sortComponent = new SortView();
    this.listComponent = new ListView();
  }

  init() {
    const editingItem = new ListItemView();
    const editingForm = new EventEditView();
    const editingDetails = new EventDetailsView();

    if (eventsArray.length > 0) {
      eventsArray = sortByDate(eventsArray);
      render(this.sortComponent, this.container);
      render(this.listComponent, this.container);

      render(editingItem, this.listComponent.getElement());
      render(editingForm, editingItem.getElement());

      render(new EventHeaderView(eventsArray[0]), editingForm.getElement());
      render(editingDetails, editingForm.getElement());
      render(new EventOfferView(eventsArray[0]), editingDetails.getElement());
      render(new EventDestinationView(eventsArray[0]), editingDetails.getElement());

      for (let i = 1; i < eventsArray.length; i++) {
        const newItem = new ListItemView();
        render(newItem, this.listComponent.getElement());
        render(eventsArray[i], newItem.getElement());
      }
    } else {
      render(new EmptyListView, this.container);
    }
  }
}

export {PagePresenter};
