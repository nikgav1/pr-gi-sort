import dotenv from 'dotenv';
dotenv.config();

import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import run from './database/connect.js';
import apiRoutes from './routes/api.js';
import pageRoutes from './routes/pages.js';
import userRoutes from './routes/user.js';
import errorHandler from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Middleware
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route handlers
app.use('/', pageRoutes);
app.use('/users', userRoutes);
app.use('/api', apiRoutes);

// Connect to MongoDB
await run();
// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
