export const parseNumber = (number: string) => {
  return parseFloat(number.split(',')[0].split('.').join(''));
};
