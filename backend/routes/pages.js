import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/main.html'));
});

router.get('/product', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/product.html'));
});

router.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/signup.html'));
});

router.get('/signin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/signin.html'));
});

router.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/profile.html'));
});

export default router;
