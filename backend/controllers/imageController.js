import sharp from 'sharp';
import fs from 'fs/promises';
import { classifyImage } from '../services/modelService.js';
import classifyEstonianTrash from '../scripts/classifyEstonianTrash.js';

export const processImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const buffer = await sharp(req.file.path).resize(224, 224).png().toBuffer();

    await fs.unlink(req.file.path);

    const prediction = await classifyImage(buffer);
    const estonianWasteType = classifyEstonianTrash(prediction.className);

    res.json({
      estonianWasteType,
      top: prediction.className,
    });
  } catch (err) {
    next(err);
  }
};
