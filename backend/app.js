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

app.use(express.static(path.join(__dirname, 'public')));

// Route handlers
app.use('/', pageRoutes);
app.use('/users', userRoutes);
app.use('/api', apiRoutes);

// Error handler
app.use(errorHandler);

async function startServer() {
  try {
    // Connect to MongoDB
    await run();

    const port = parseInt(process.env.PORT) || 3000;
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();
