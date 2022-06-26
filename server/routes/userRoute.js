import express from 'express';
// Controllers
import {
  deleteUser,
  followUser,
  getAllUsers,
  getUser,
  unfollowUser,
  updateUser,
} from '../controllers/userControllers.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.put('/:id/follow', followUser);
router.put('/:id/unfollow', unfollowUser);

export default router;
