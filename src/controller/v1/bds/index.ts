import { validationResult } from 'express-validator';
import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { getDoc } from 'services/sheet';
import { fullTextSearch } from 'utils';
import { isNumber } from 'lodash';
import { parseNumber } from 'utils/parseNumber';
import { parseString } from 'utils/parseString';

export async function getLitsBDS(req, res, next) {
  const { tieu_de, loai_hinh_bds, quan, tinh, huyen, min_gia, max_gia, dien_tich, offset, limit } = req.query;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const sheet = (await getDoc('bds')) as GoogleSpreadsheetWorksheet;
  let total = sheet?.gridProperties?.rowCount - 1;
  let data = [];
  if (isNumber(offset) && isNumber(limit)) {
    data = await sheet.getRows({ offset: offset, limit: limit });
  } else {
    const array = await sheet.getRows();
    let data = array;
    if (tieu_de) {
      data = fullTextSearch(array, tieu_de, 'tieu_de');
    }

    if (loai_hinh_bds) {
      data = data.filter((item) => parseString(item.get('loai_hinh_bds')) === parseString(loai_hinh_bds));
    }
    if (quan) {
      data = data.filter((item) => parseString(item.get('quan')) === parseString(quan));
    }
    if (tinh) {
      data = data.filter((item) => parseString(item.get('tinh')) === parseString(tinh));
    }
    if (huyen) {
      data = data.filter((item) => parseString(item.get('huyen')) === parseString(huyen));
    }
    if (dien_tich) {
      data = data.filter((item) => parseString(item.get('dien_tich')) === parseString(dien_tich));
    }

    if (min_gia) {
      data = data.filter((item) => {
        return parseNumber(item.get('gia')) >= parseFloat(min_gia);
      });
    }
    if (max_gia) {
      data = data.filter((item) => parseNumber(item.get('gia')) <= parseFloat(max_gia));
    }
  }

  if (!offset || !limit) {
    total = data.length;
  }
  return res.status(200).json({
    data: data.map((item) => ({ ...item.toObject(), user_liked_ids: item.get('user_liked_ids').split(',') })),
    total,
  });
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
