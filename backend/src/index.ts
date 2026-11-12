import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import problemRoutes from './routes/problemRoutes';
import analyticsRoutes from './routes/analyticsRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'online', message: 'CodeForge API is running!' });
});

app.listen(PORT, () => {
  console.log(`?? Server running on http://localhost:${PORT}`);
});
