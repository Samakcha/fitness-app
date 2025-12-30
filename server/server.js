import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Allow requests from the frontend
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
  // Add Vercel preview URLs if needed dynamically or allow all for now if safe
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    // Allow any origin for now to simplify deployment debugging, or restrict strict
    // For now, let's keep it somewhat open or strict based on env
    if (allowedOrigins.indexOf(origin) !== -1 || true) { // Allowing all for simplicity in this demo, user can restrict later
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(cookieParser());

// Database Connection
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
  }
};

// Connect to DB immediately for local, or on request for serverless
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Conditionally listen
if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;