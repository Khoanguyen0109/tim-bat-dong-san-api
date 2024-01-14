import { Router } from 'express';

import users from './users';

import banners from './banners';
import bds from './bds';

const router = Router();

router.use('/users', users);
router.use('/bds', bds);
router.use('/banners', banners);

export default router;
