import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors'; // Import cors
import userRoutes from './routes/userRoutes';
import appointmentRoutes from './routes/appointmentRoutes';

const app: Application = express();

// Middleware
app.use(express.json()); // Body parser for JSON

// CORS: allow multiple frontend origins (localhost and 127.0.0.1 by default)
const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser or same-origin
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Explicitly handle preflight
app.options('*', cors());

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);

// Health Check Route
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', message: 'Backend is healthy' });
});

// Basic Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.get('/', (_req, res) => res.json({ message: 'API running' }));
// app.get('/', (_req, res) => res.redirect('https://Github.com/SaranGoutham'));
export default app;
