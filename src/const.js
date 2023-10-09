const DATE_FORMAT = {
  shortFormat: 'DD MMM',
  pickerFormat: 'DD/MM/YY HH:mm',
  editFormat: 'DD/MM/YYTHH:mm',
  saveFormat: 'YYYY-MM-DDTHH:mm',
  dateOnlyFormat: 'YYYY-MM-DD'
};

const MAX_TIME = {
  HOURS: 24,
  MINUTES: 60,
  DAYS: 31
};

const SORT_EVENTS = {
  Everything: 'Click New Event to create your first point',
  Future: 'There are no future events now',
  Present: 'There are no present events now',
  Past: 'There are no past events now'
};

const DEFAULT_FILTER = 'Everything';

const FilterType = {
  EVERYTHING: 'Everything',
  FUTURE: 'Future',
  PRESENT: 'Present',
  PAST: 'Past'
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const SortType = {
  DAY: {
    name: 'day',
    isEnabled: true,
  },
  EVENT: {
    name: 'event',
    isEnabled: false,
  },
  TIME: {
    name: 'time',
    isEnabled: true,
  },
  PRICE: {
    name: 'price',
    isEnabled: true,
  },
  OFFERS: {
    name: 'offers',
    isEnabled: false,
  }
};

const DEFAULT_SORT_TYPE = SortType.DAY.name;

const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

const EDIT_TYPE = {
  edit: {
    type: 'edit',
    text: 'Delete'
  },
  new: {
    type: 'new',
    text: 'Cancel'
  }
};

export {
  MAX_TIME,
  DATE_FORMAT,
  SORT_EVENTS,
  DEFAULT_FILTER,
  FilterType,
  Mode,
  SortType,
  UserAction,
  UpdateType,
  DEFAULT_SORT_TYPE,
  EDIT_TYPE,
};
