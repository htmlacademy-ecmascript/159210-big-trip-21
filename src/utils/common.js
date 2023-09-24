const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const formalizeTime = (num) => num < 10 ? `0${num}` : `${num}`;

const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

const getRandomBoolean = () => Math.random() < 0.5;

const getRandomKey = (obj) => Object.keys(obj)[getRandomInteger(0, Object.keys(obj).length - 1)];

export {
  getRandomInteger,
  formalizeTime,
  getRandomArrayElement,
  getRandomBoolean,
  getRandomKey
};
