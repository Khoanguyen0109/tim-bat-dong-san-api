import { getBDSDetail, getLitsBDS } from 'controller/v1/bds';
import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';

const router = Router();

router.get('/', expressAsyncHandler(getLitsBDS));
router.get('/:id', expressAsyncHandler(getBDSDetail));

export default router;
