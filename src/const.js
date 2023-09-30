const ENTRY_COUNT = 4;
const MINUTES_ROUND = 5;
const MIN_PRICE = 100;
const MAX_PRICE = 1000;
const DATE_FORMAT = 'DD MMM';
const EDIT_DATE_FORMAT = 'DD/MM/YY HH:mm';

const PHOTOS_SRC = 'https://loremflickr.com/248/152?random=';

const PHOTOS_BORDER_NUMS = {
  min: 100,
  max: 200
};

const MAX_TIME = {
  HOURS: 24,
  MINUTES: 60,
  DAYS: 31
};
const PHOTOS_COUNT = {
  min: 3,
  max: 6
};

const EVENT_TYPES = [
  {
    type: 'Taxi',
    offers: ['luggage', 'comfort']
  }, {
    type: 'Bus',
    offers: ['luggage', 'comfort', 'seats', 'meal']
  }, {
    type: 'Train',
    offers: ['luggage', 'comfort', 'seats', 'meal']
  }, {
    type: 'Ship',
    offers: ['luggage', 'comfort', 'meal']
  }, {
    type: 'Drive',
    offers: ['comfort']
  }, {
    type: 'Flight',
    offers: ['luggage', 'comfort', 'seats', 'meal']
  }, {
    type: 'Check-in',
    offers: ['luggage', 'comfort', 'meal']
  }, {
    type: 'Sightseeing',
    offers: []
  }, {
    type: 'Restaurant',
    offers: ['seats']
  }
];

const DESTINATIONS = {
  Amsterdam: {
    description: 'Рекомендуется совершить прогулку на лодке по каналам города и Озеру Любви, однако не надо забывать, что антарктический пояс связывает культурный ландшафт, несмотря на это, обратный обмен болгарской валюты при выезде ограничен.',
    photos: [1, 2, 3, 4]
  },
  Geneva: {
    description: 'Бенгальский залив, куда входят Пик-Дистрикт, Сноудония и другие многочисленные национальные резерваты природы и парки, неравномерен. Добыча жемчуга перевозит подземный сток. Бенгальский залив недоступно иллюстрирует культурный альбатрос.',
    photos: [5, 6, 7, 8, 9]
  },
  Chamonix: {
    description: 'Нижнее течение, на первый взгляд, вразнобой притягивает широкий официальный язык, именно здесь с 8.00 до 11.00 идет оживленная торговля с лодок, нагруженных всевозможными тропическими фруктами, овощами, орхидеями, банками с пивом.',
    photos: [10, 11, 12]
  }
};

const OFFERS = {
  luggage: 'Add luggage',
  comfort: 'Switch to comfort class',
  meal: 'Add meal',
  seats: 'Choose seats',
  train: 'Travel by train'
};

const OFFERS_PRICES = {
  luggage: 30,
  comfort: 100,
  meal: 15,
  seats: 5,
  train: 40
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
    isChecked: false
  },
  EVENT: {
    name: 'event',
    isEnabled: false,
    isChecked: false
  },
  TIME: {
    name: 'time',
    isEnabled: true,
    isChecked: false
  },
  PRICE: {
    name: 'price',
    isEnabled: true,
    isChecked: true
  },
  OFFERS: {
    name: 'offers',
    isEnabled: false,
    isChecked: false
  }
};

export {
  ENTRY_COUNT,
  MAX_TIME,
  MINUTES_ROUND,
  OFFERS,
  OFFERS_PRICES,
  MIN_PRICE,
  MAX_PRICE,
  DATE_FORMAT,
  EVENT_TYPES,
  SORT_EVENTS,
  DEFAULT_FILTER,
  EDIT_DATE_FORMAT,
  DESTINATIONS,
  PHOTOS_COUNT,
  PHOTOS_BORDER_NUMS,
  PHOTOS_SRC,
  FilterType,
  Mode,
  SortType
};
