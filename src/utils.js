const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const formalizeTime = (num) => {
  if (num < 10) {
    return `0${num}`;
  } else {
    return `${num}`;
  }
};

const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

const getRandomBoolean = () => Math.random() < 0.5;

const getRandomKey = (obj) => Object.keys(obj)[getRandomInteger(0, Object.keys(obj).length - 1)];

const sortByDate = (arrayOfObjects) => {
  const newArray = arrayOfObjects.sort((a, b) => {
    if (Date.parse(a.entry.date) < Date.parse(b.entry.date)) {
      return -1;
    }
    if (Date.parse(a.entry.date) > Date.parse(b.entry.date)) {
      return 1;
    }
    return 0;
  });

  return newArray;
};

export {
  getRandomInteger,
  formalizeTime,
  getRandomArrayElement,
  getRandomBoolean,
  getRandomKey,
  sortByDate
};
