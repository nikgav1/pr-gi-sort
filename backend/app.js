import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import * as tf from '@tensorflow/tfjs-node';
import * as mobilenet from '@tensorflow-models/mobilenet';
import classifyEstonianTrash from './scripts/classifyEstonianTrash.js';

// Reduce TensorFlow log verbosity
process.env.TF_CPP_MIN_LOG_LEVEL = '2';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Load a smaller MobileNet variant (alpha=0.5) for reduced memory usage
let model;
(async () => {
  model = await mobilenet.load({ version: 2, alpha: 0.5 });
  console.log('MobileNetV2 (alpha=0.5) loaded');
})();

app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    // Resize image to 224×224 using sharp to reduce Tensor memory
    const resizedBuffer = await sharp(req.file.buffer)
      .resize(224, 224)
      .toFormat('png')
      .toBuffer();

      const inputTensor = tf.tidy(() => {
        const imgTensor = tf.node.decodeImage(resizedBuffer, 3);
        const expanded = imgTensor.expandDims(0);
        imgTensor.dispose();
        return expanded;
      });
  
      // Run async inference outside of tidy
      const predictions = await model.classify(inputTensor);
      inputTensor.dispose();

    // Get top result
    const top = predictions[0].className;
    const estonianWasteType = classifyEstonianTrash(top);

    res.json({ estonianWasteType, top });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
