import { validationResult } from 'express-validator';
import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { getDoc } from 'services/sheet';
import { fullTextSearch } from 'utils';
import { isNumber } from 'lodash';
import { parseNumber } from 'utils/parseNumber';
import { parseString } from 'utils/parseString';
import size from 'lodash/size';
export async function getLitsBDS(req, res, next) {
  const {
    tieu_de,
    loai_hinh_bds,
    loai_hinh_kinh_doanh,
    quan,
    tinh,
    huyen,
    min_gia,
    max_gia,
    dien_tich,
    offset,
    limit,
    huong,
  } = req.query;
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
    data = array;
    if (tieu_de) {
      data = fullTextSearch(array, tieu_de, 'tieu_de');
    }

    if (loai_hinh_bds) {
      data = data.filter(() =>
        loai_hinh_bds.find((item) => parseString(item) === parseString(item.get('loai_hinh_bds'))),
      );
    }

    if (quan) {
      data = data.filter(() => quan.find((item) => parseString(item) === parseString(item.get('quan'))));
    }
    if (tinh) {
      data = data.filter(() => tinh.find((item) => parseString(item) === parseString(item.get('tinh'))));
    }
    if (huyen) {
      data = data.filter(() => huyen.find((item) => parseString(item) === parseString(item.get('huyen'))));
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
    data: data.map((item) => ({
      ...item.toObject(),
      image: item.get('image').split(','),
      user_liked_ids: item.get('user_liked_ids').split(','),
    })),
    total,
  });
}

export async function getLitsBDSFilter(req, res, next) {
  const {
    tieu_de,
    loai_hinh_bds,
    quan,
    tinh,
    huyen,
    min_gia,
    max_gia,
    dien_tich,
    huong,
    loai_hinh_kinh_doanh,
    duong_truoc_nha,
  } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const sheet = (await getDoc('bds')) as GoogleSpreadsheetWorksheet;
  let total = sheet?.gridProperties?.rowCount - 1;
  let data = [];
  const array = await sheet.getRows();
  data = array;
  if (tieu_de) {
    console.log('data', data);

    data = fullTextSearch(array, tieu_de, 'tieu_de');
  }
  if (size(huong)) {
    data = data.filter((item) => huong.find((q) => parseString(q) === parseString(item.get('huong'))));
  }

  if (size(duong_truoc_nha)) {
    data = data.filter((item) => duong_truoc_nha.find((q) => parseString(q) === parseString(item.get('duong_truoc_nha'))));
  }
  if (loai_hinh_kinh_doanh) {
    data = data.filter((item) => parseString(item.get('loai_hinh_kinh_doanh')) === parseString(loai_hinh_kinh_doanh));
  }

  if (size(quan)) {
    data = data.filter((item) => quan.find((q) => parseString(q) === parseString(item.get('quan'))));
  }
  if (size(tinh)) {
    data = data.filter((item) => tinh.find((q) => parseString(q) === parseString(item.get('tinh'))));
  }
  if (size(huyen)) {
    data = data.filter((item) => huyen.find((q) => parseString(q) === parseString(item.get('huyen'))));
  }
  if (dien_tich) {
    data = data.filter((item) => parseString(item.get('dien_tich_dat')) === parseString(dien_tich));
  }

  if (size(loai_hinh_bds)) {
    data = data.filter((item) => loai_hinh_bds.includes(item.get('loai_hinh_bds')));
  }

  if (min_gia) {
    data = data.filter((item) => {
      console.log('first', parseNumber(item.get('gia')) >= parseFloat(min_gia));
      return parseNumber(item.get('gia')) >= parseFloat(min_gia);
    });
  }
  if (max_gia) {
    data = data.filter((item) => parseNumber(item.get('gia')) <= parseFloat(max_gia));
  }

  return res.status(200).json({
    data: data.map((item) => ({
      ...item.toObject(),
      image: item.get('image').split(','),
      user_liked_ids: item.get('user_liked_ids').split(','),
    })),
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
      user_liked_ids: doc.get('user_liked_ids').split(','),
      image: doc.get('image').split(','),
    },
  });
}
