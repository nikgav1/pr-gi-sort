import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { RekognitionClient, DetectLabelsCommand } from "@aws-sdk/client-rekognition";
import { fromEnv } from "@aws-sdk/credential-providers";
import multer from "multer";
import fs from "fs";
import dotenv from "dotenv"; 

dotenv.config(); 
console.log(process.env.AWS_REGION);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static("public"));
app.use(express.json());

const upload = multer({ dest: "uploads/" });

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

    await fs.promises.unlink(req.file.path);

    const estonianTrashType = classifyEstonianTrash(Labels);

    res.json({ estonianTrashType });
  } catch (err) {
    if (req.file) {
      await fs.promises.unlink(req.file.path);
    }
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
});

function classifyEstonianTrash(labels) {
  // Mapping Rekognition label names to Estonian waste types
  const mapping = {
    "Plastic": "Plastik",
    "Bottle": "Plastik",
    "Water Bottle": "Plastik",
    "Cup": "Plastik",
    "Bag": "Plastik",
    "Paper": "Paber ja kartong",
    "Cardboard": "Paber ja kartong",
    "Newspaper": "Paber ja kartong",
    "Food": "Biojäätmed",
    "Fruit": "Biojäätmed",
    "Vegetable": "Biojäätmed",
    "Glass": "Klaas",
    "Jar": "Klaas",
    "Metal": "Metall",
    "Can": "Metall",
    "Tin": "Metall",
    "Electronics": "Elektroonika",
    "Battery": "Ohtlikud jäätmed",
    "Light Bulb": "Ohtlikud jäätmed",
    "Packaging": "Pakend",
    // Add more mappings as needed
  };

  // Find the first matching Estonian waste type
  for (const label of labels) {
    if (mapping[label.Name]) {
      return mapping[label.Name];
    }
  }
  return "Segajäätmed"; // Default to mixed waste if no match
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
