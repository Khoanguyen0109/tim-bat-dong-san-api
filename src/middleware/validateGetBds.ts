import { query } from 'express-validator';

export const bdsValidate = () => {
  return [
    query('tieu_de').optional().isString().trim(),
    query('loai_hinh_bds').optional().trim(),
    query('quan').optional().trim(),
    query('tinh').optional().trim(),
    query('huyen').optional().trim(),
    query('min_gia').optional().isNumeric(),
    query('max_gia').optional().isNumeric(),
    query('dien_tich').optional().trim(),
    query('offset').optional().isNumeric(),
    query('limit').optional().isNumeric(),
  ];
};
