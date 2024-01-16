import { Router } from 'express';

import users from './users';

import banners from './banners';
import bds from './bds';
import services from './services';
import settings from './settings-custom';
import projects from './projects';

const router = Router();

router.use('/users', users);
router.use('/bds', bds);
router.use('/banners', banners);
router.use('/services', services);
router.use('/settings', settings);
router.use('/project', projects);

export default router;
