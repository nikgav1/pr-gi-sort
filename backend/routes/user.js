import express from 'express';
import { signup, signin, getUserInfo } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/user-info', authenticateToken, getUserInfo);

export default router;
