import { ENTRY_COUNT } from '../const.js';
import { SortView } from '../view/sort-view.js';
import { ListView } from '../view/list-view.js';
import { EventLineView } from '../view/event-line-view.js';
import { EventEditView } from '../view/event-edit-view.js';
import { ListItemView } from '../view/list-item-view.js';
import { EventHeaderView } from '../view/event-header-view.js';
import { EventDetailsView } from '../view/event-details-view.js';
import { EventOfferView } from '../view/event-offer-view.js';
import { EventDestinationView } from '../view/event-destination-view.js';
import { render } from '../render.js';

class PagePresenter {
  sortComponent = new SortView();
  listComponent = new ListView();

  constructor ({container}) {
    this.container = container;
  }

  init() {
    const editingItem = new ListItemView();
    const editingForm = new EventEditView();
    const editingDetails = new EventDetailsView();

    render(this.sortComponent, this.container);
    render(this.listComponent, this.container);

    render(editingItem, this.listComponent.getElement());
    render(editingForm, editingItem.getElement());
    render(new EventHeaderView, editingForm.getElement());
    render(editingDetails, editingForm.getElement());
    render(new EventOfferView, editingDetails.getElement());
    render(new EventDestinationView, editingDetails.getElement());

    for (let i = 0; i < ENTRY_COUNT; i++) {
      const newItem = new ListItemView();
      render(newItem, this.listComponent.getElement());
      render(new EventLineView, newItem.getElement());
    }
  }
}

export {PagePresenter};
