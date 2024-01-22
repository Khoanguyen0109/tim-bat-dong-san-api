import { validationResult } from 'express-validator';
import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { v4 as uuidv4 } from 'uuid';

import { getDoc } from 'services/sheet';
import { STATUS } from 'utils/constants';
import getCurrentDateWithTimezone from 'utils/getCurrentDayFormatTimezone';

export async function getUserInfo(req, res, next) {
  const { userId } = req.params;
  const sheet = (await getDoc('users')) as GoogleSpreadsheetWorksheet;
  const data = (await sheet.getRows()).find((item) => item.get('id') === userId);
  console.log('data', data);
  if (!data) {
    return res.status(404).json({ message: 'not found' });
  }
  return res.status(200).json({ data: data.toObject() });
}

export async function updateFollowed(req, res, next) {
  const { userId } = req.params;
  const sheet = (await getDoc('users')) as GoogleSpreadsheetWorksheet;
  const rows = await sheet.getRows();
  const dataIndex = rows.findIndex((item) => item.get('id') === userId && !item.get('followed'));
  if (dataIndex !== -1) {
    rows[dataIndex].set('followed', true);
    await rows[dataIndex].save();
  }
  return res.status(200).json({ data: 'success' });
}

export async function getListFavorite(req, res, next) {
  const { userId } = req.params;
  const sheet = (await getDoc('danh_muc_yeu_thich')) as GoogleSpreadsheetWorksheet;
  const data = (await sheet.getRows()).filter((item) => item.get('user_id') === userId).map((item) => item.toObject());
  return res.status(200).json({ data: data });
}

export async function updateFavorites(req, res, next) {
  const { userId } = req.params;
  console.log('userId', userId)

  const { bds } = req.body;
  const sheet = (await getDoc('danh_muc_yeu_thich')) as GoogleSpreadsheetWorksheet;
  const rows = await sheet.getRows();
  const dataIndex = rows.findIndex((item) => item.get('user_id') === userId && item.get('bds_id') === bds.id);
  if (dataIndex !== -1) {
    await rows[dataIndex].delete();
  } else {
    const { tieu_de, id_danh_muc, mo_ta_thumbnail, mo_ta_chi_tiet, dia_chi, tinh, quan, huyen, gia } = bds;
    const newFavorites = {
      id: uuidv4(),
      user_id: userId,
      bds_id: bds.id,
      tieu_de,
      id_danh_muc,
      mo_ta_thumbnail,
      mo_ta_chi_tiet,
      dia_chi,
      tinh,
      quan,
      huyen,
      gia,
    };
    await sheet.addRow(newFavorites);
  }
  return res.status(200).json({ message: 'success' });
}
