import express from 'express';
import upload from '../middleware/upload.js';
import { processImage } from '../controllers/imageController.js';
import { logTrash } from '../controllers/logTrashController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/upload', authenticateToken, upload.single('image'), processImage);
router.post('/log-trash', authenticateToken, logTrash);
router.get('/validate-token', authenticateToken, (req, res) => {
  res.json({ valid: true });
});

export default router;
