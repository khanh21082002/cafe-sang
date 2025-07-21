import express from 'express';
import {
  getMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getTopOrderedMenuItems
} from '../controllers/menu.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', getMenu);
router.get('/top', getTopOrderedMenuItems);
router.post('/', authMiddleware(['admin', 'staff']), createMenuItem);
router.put('/:id', authMiddleware(['admin', 'staff']), updateMenuItem);
router.delete('/:id', authMiddleware(['admin', 'staff']), deleteMenuItem);

export default router;
