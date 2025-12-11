import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Allow requests from the frontend
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL // Vercel production URL
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1 && !origin.includes('vercel.app')) {
      // Allow all vercel.app references for preview deployments
      return callback(null, true); // For simplicity in dev/preview, or strict:
      // var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      // return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(cookieParser());

// Database Connection
const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
  }
};

// Routes
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import classRoutes from './routes/classes.js';

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/classes', classRoutes);

app.get('/', (req, res) => {
  res.send('Fitness App API is running...');
});

// For Vercel, we need to export the handler
// But for local dev, we need to listen
if (process.env.NODE_ENV !== 'production') {
  connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} else {
  // In production (Vercel), just connect to DB
  connectDB();
}

export default app;
