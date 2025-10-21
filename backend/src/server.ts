import app from './app';
import dotenv from 'dotenv';

dotenv.config({ path: __dirname + '/../.env' }); // Load .env from backend root

const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log(`Backend server running on port ${PORT}`);
    console.log(`Access backend at http://localhost:${PORT}`);
});
