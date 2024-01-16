import { getProjectDetail, getProjects } from 'controller/v1/projects';
import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';

const router = Router();

router.get('/', expressAsyncHandler(getProjects));
router.get('/:id', expressAsyncHandler(getProjectDetail));

export default router;
