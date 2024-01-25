import lowerCase from 'lodash/lowerCase'

export function fullTextSearch(items, text, key) {
  text = text.split(' ');
  return items.filter(function (item) {
    return text.every(function (el) {
      return  item.get(`${key}`).indexOf(el.toLowerCase()) > -1;
    });
  });
}
