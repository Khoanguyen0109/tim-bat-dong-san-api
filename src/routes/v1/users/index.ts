import { getListFavorite, getUserInfo, updateFavorites, updateFollowed } from 'controller/v1/users';
import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';

const router = Router();

router.get('/:userId', expressAsyncHandler(getUserInfo));
router.put('/:userId/update_followed', expressAsyncHandler(updateFollowed));

router.get('/:userId/favorites', expressAsyncHandler(getListFavorite));
router.post('/:userId/favorites', expressAsyncHandler(updateFavorites));

export default router;
