import express from 'express';
import upload from '../middleware/upload.js';
import { processImage } from '../controllers/imageController.js';

const router = express.Router();

router.post('/upload', upload.single('image'), processImage);

export default router;
