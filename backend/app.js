import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express from 'express';
import multer from 'multer';
import * as tf from '@tensorflow/tfjs-node';
import * as mobilenet from '@tensorflow-models/mobilenet';
import classifyEstonianTrash from './scripts/classifyEstonianTrash.js';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

let model;

(async () => {
  model = await mobilenet.load({ version: 2, alpha: 1.0 });
  console.log('MobileNetV2 loaded');
})();

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    // Decode image buffer to TF tensor (H×W×3), auto-normalize to [0,255]
    const imgTensor = tf.node.decodeImage(req.file.buffer, 3);  
    // Run classification
    const predictions = await model.classify(imgTensor);

    const top = predictions[0].className;

    const estonianWasteType = classifyEstonianTrash(top);

    imgTensor.dispose();

    res.json({ estonianWasteType, top });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});