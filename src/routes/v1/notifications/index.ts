import { getNotifications } from 'controller/v1/notification';
import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';

const router = Router();

router.get('/', expressAsyncHandler(getNotifications));

export default router;
