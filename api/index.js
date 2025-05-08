import express from 'express';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import productRoutes from '../routes/productRoutes.js';
import userRoutes from '../routes/userRoutes.js';
import orderRoutes from '../routes/orderRoutes.js';
import { notFound, errorHandler } from '../middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Routes (no static serving needed here)
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.get('/api/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID));

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    const imagesPath = path.join(__dirname, '..', 'Proshop-frontend', 'public', 'images');
    import('fs').then(fs => {
      if (!fs.existsSync(imagesPath)) {
        fs.mkdirSync(imagesPath, { recursive: true });
        console.log('Images directory created in Proshop-frontend/public');
      }
    });
  });
}).catch((error) => {
  console.error('Failed to start server:', error);
});