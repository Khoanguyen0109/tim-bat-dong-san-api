import { Router } from 'express';

import users from './users';

import banners from './banners';
import bds from './bds';
import services from './services';
import settings from './settings-custom';

const router = Router();

router.use('/users', users);
router.use('/bds', bds);
router.use('/banners', banners);
router.use('/services', services);
// router.use('/settings', settings);

export default router;
