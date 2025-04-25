import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { RekognitionClient, DetectLabelsCommand } from "@aws-sdk/client-rekognition";
import { fromEnv } from "@aws-sdk/credential-providers";
import multer from "multer";
import fs from "fs";
import dotenv from "dotenv"; 

import estonianWasteTypes from "./estonian-wastes.js";

dotenv.config(); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static("public"));
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}

const upload = multer({ dest: uploadsDir });

const client = new RekognitionClient({
  region: process.env.AWS_REGION,
  credentials: fromEnv(),
});

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const imageBytes = await fs.promises.readFile(req.file.path);

    const command = new DetectLabelsCommand({
      Image: { Bytes: imageBytes },
      MaxLabels: 10,
      MinConfidence: 70,
    });
    const { Labels } = await client.send(command);

    // Only try to delete the file if it exists
    try {
      await fs.promises.unlink(req.file.path);
    } catch (unlinkError) {
      console.warn('Failed to delete uploaded file:', unlinkError.message);
    }

    const estonianTrashType = classifyEstonianTrash(Labels);

    res.json({ estonianTrashType });
  } catch (err) {
    if (req.file) {
      try {
        await fs.promises.unlink(req.file.path);
      } catch (unlinkError) {
        console.warn('Failed to delete uploaded file:', unlinkError.message);
      }
    }
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
});

function classifyEstonianTrash(labels) {
  for (const label of labels) {
    // Check confidence threshold
    if (label.Confidence < 70) continue;

    // Check main label name
    if (estonianWasteTypes[label.Name]) {
      return estonianWasteTypes[label.Name];
    }

    // Check aliases
    if (label.Aliases) {
      for (const alias of label.Aliases) {
        if (estonianWasteTypes[alias.Name]) {
          return estonianWasteTypes[alias.Name];
        }
      }
    }

    // Check parent labels
    if (label.Parents) {
      for (const parent of label.Parents) {
        if (estonianWasteTypes[parent.Name]) {
          return estonianWasteTypes[parent.Name];
        }
      }
    }
  }

  // Default to mixed waste if no match found
  return "Segajäätmed";
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
