import { Router } from 'express';

import users from './users';

import banners from './banners';
import bds from './bds';
import services from './services';
import settings from './settings-custom';
import projects from './projects';
import categories from './categories';

const router = Router();

router.use('/users', users);
router.use('/bds', bds);
router.use('/banners', banners);
router.use('/services', services);
router.use('/settings', settings);
router.use('/projects', projects);
router.use('/categories', categories);

export default router;
