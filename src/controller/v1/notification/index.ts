import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { getDoc } from 'services/sheet';

export async function getNotifications(req, res, next) {
  const sheet = (await getDoc('thong_bao')) as GoogleSpreadsheetWorksheet;
  const data = (await sheet.getRows()).map((item) => item.toObject());
  return res.status(200).json({ data });
}
