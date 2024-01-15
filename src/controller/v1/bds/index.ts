import { validationResult } from 'express-validator';
import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { getDoc } from 'services/sheet';
import { fullTextSearch } from 'utils';
import { isNumber } from 'lodash';

export async function getLitsBDS(req, res, next) {
  const { query, name, offset, limit, categories } = req.query;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const sheet = (await getDoc('bds')) as GoogleSpreadsheetWorksheet;
  let data = [];
  const rows = await sheet.getRows();
  const total = sheet?.gridProperties?.rowCount - 1;
  if (total) {
    switch (true) {
      case Boolean(query):
        const array = await sheet.getRows();
        data = fullTextSearch(array, query);
        break;
      case Boolean(categories):
        data = rows.filter((item) => item.get('id_danh_muc'));
        break;
      case isNumber(offset) && isNumber(limit):
        data = await sheet.getRows({ offset: offset, limit: limit });
        break;
      default:
        data = await sheet.getRows();
        break;
    }
  }
  return res.status(200).json({ data: data.map((item) => item.toObject()), total });
}

export async function getBDSDetail(req, res, next) {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  const sheet = (await getDoc('bds')) as GoogleSpreadsheetWorksheet;

  const array = await sheet.getRows();
  const doc = array.find((item) => item.get('id') === id);
  if (!doc) {
    return res.status(404).json({ message: 'Not Found' });
  }
  return res.status(200).json({
    data: {
      ...doc.toObject(),
      image: doc
        .get('image')
        .split(',')
        .map((item) => ({ image: item })),
    },
  });
}
