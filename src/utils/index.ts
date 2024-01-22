export function fullTextSearch(items, text, key) {
  text = text.split(' ');
  return items.filter(function (item) {
    return text.every(function (el) {
      console.log('first', item.get(`${key}`));
      return item.get(`${key}`).indexOf(el) > -1;
    });
  });
}
