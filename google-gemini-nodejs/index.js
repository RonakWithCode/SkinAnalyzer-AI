import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import imageRoutes from './routes/imageRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Handle large JSON payloads

app.use('/api/images', imageRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
