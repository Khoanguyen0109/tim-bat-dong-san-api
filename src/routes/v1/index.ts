import { Router } from 'express';

import users from './users';

import banners from './banners';

const router = Router();

router.use('/users', users);

router.use('/banners', banners);

export default router;
