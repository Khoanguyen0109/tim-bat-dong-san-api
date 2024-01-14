import { getSettings } from 'controller/v1/settings';
import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';

const router = Router();

router.get('/', expressAsyncHandler(getSettings));

export default router;
