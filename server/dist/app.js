import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
dotenv.config();
const app = express();
// Middlewares
app.use(cors());
app.use(express.json());
// Base Route
app.get('/', (req, res) => {
    res.send('GigFlow API is running...');
});
// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
// Error handling
app.use(notFound);
app.use(errorHandler);
export default app;
