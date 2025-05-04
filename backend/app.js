import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import * as tf from '@tensorflow/tfjs-node';
import * as mobilenet from '@tensorflow-models/mobilenet';
import classifyEstonianTrash from './scripts/classifyEstonianTrash.js';

process.env.TF_CPP_MIN_LOG_LEVEL = '2';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

sharp.cache(false);
sharp.concurrency(1);

const upload = multer({
  dest: '/tmp/uploads',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

let model;
const loadModel = async () => {
  if (!model) {
    model = await mobilenet.load({ version: 2, alpha: 1 });
    console.log('MobileNetV2 loaded');
  }
};

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/product', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/product.html'));
});

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    // Ensure model is ready
    await loadModel();

    // Resize + convert to PNG in memory, returns Buffer
    const buffer = await sharp(req.file.path).resize(224, 224).png().toBuffer();

    fs.unlink(req.file.path, err => {
      if (err) console.error('Temp file cleanup error:', err);
    });

    const inputTensor = tf.tidy(() => {
      const img = tf.node
        .decodeImage(buffer, 3)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .expandDims(0);
      return img;
    });

    // Classify and free the input tensor
    const predictions = await model.classify(inputTensor);
    inputTensor.dispose();

    const top = predictions[0].className;
    const estonianWasteType = classifyEstonianTrash(top);

    // Send result
    res.json({ estonianWasteType, top });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
