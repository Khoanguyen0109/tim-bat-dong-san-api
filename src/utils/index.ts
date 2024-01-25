export function fullTextSearch(items, text, key) {
  text = text.toLowerCase().split(' ');
  return items.filter(function (item) {
    return text.every(function (el) {
      return item.toLowerCase().get(`${key}`).indexOf(el) > -1;
    });
  });
}
