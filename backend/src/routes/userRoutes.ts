import { Router } from 'express';
import { getAllUsers } from '../controllers/userController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

// Admin-only route to get all users
router.get('/', protect, authorize(['admin']), getAllUsers);

export default router;

