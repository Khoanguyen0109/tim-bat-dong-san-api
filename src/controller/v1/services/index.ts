import { GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { getDoc } from "services/sheet";

export async function getServices(req, res, next) {
    const sheet = (await getDoc('dich_vu')) as GoogleSpreadsheetWorksheet;
    const data = (await sheet.getRows()).map((item) => item.toObject());
    return res.status(200).json({ data });
  }
  