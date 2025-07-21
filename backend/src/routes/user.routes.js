import express from 'express';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserPoints,
  updateUserRole,
  updateUserInStore
} from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.patch('/:id/points', updateUserPoints);
router.patch('/:id/role', updateUserRole);
router.patch('/:id/inStore', updateUserInStore);

export default router;
