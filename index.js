import express from 'express';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import productRoutes from '../routes/productRoutes.js';
import userRoutes from '../routes/userRoutes.js';
import orderRoutes from '../routes/orderRoutes.js';
import { notFound, errorHandler } from '../middleware/errorMiddleware.js';

// Initialize Express app
const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || 'https://shadowshop.vercel.app',
      'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.get('/api/config/paypal', (req, res) =>
  res.json({ clientId: process.env.PAYPAL_CLIENT_ID })
);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB and export handler for Vercel
let isConnected = false;
export default async (req, res) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log('MongoDB connected');
    } catch (error) {
      console.error('MongoDB connection failed:', error);
      res.status(500).json({ message: 'Server error: Database connection failed' });
      return;
    }
  }

  // Handle request with Express
  return app(req, res);
};
// connectDB().then(() => {
//   app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
//     const imagesPath = path.join(__dirname, '..', 'Proshop-frontend', 'public', 'images');
//     import('fs').then(fs => {
//       if (!fs.existsSync(imagesPath)) {
//         fs.mkdirSync(imagesPath, { recursive: true });
//         console.log('Images directory created in Proshop-frontend/public');
//       }
//     });
//   });
// }).catch((error) => {
//   console.error('Failed to start server:', error);
// });