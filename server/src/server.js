import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import evidenceRoutes from './routes/evidenceRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/evidence', evidenceRoutes);

// Basic "Health Check" route
app.get('/', (req, res) => res.send('API is running...'));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server on port ${PORT}`));
  })
  .catch(err => console.error('DB Connection Error:', err));
