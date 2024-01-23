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
  console.log('userId', userId);

  const { bds } = req.body;
  const sheet = (await getDoc('bds')) as GoogleSpreadsheetWorksheet;
  const rows = await sheet.getRows();
  const dataIndex = rows.findIndex((item) => item.get('id') === bds.id);
  const userLiked = rows[dataIndex].get('user_liked_ids')?.split(',');
  console.log('userLiked', userLiked)
  if (userLiked.includes(userId)) {
    rows[dataIndex].set('user_liked_ids', userLiked.filter((item) => item !== userId).join(','));
  } else {
    rows[dataIndex].set('user_liked_ids', [...userLiked, userId].join(','));
  }
  await rows[dataIndex].save(); // save updates on a row

  return res.status(200).json({ message: 'success' });
}
