import path from 'path';
import { fileURLToPath } from 'url';

import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
import feedbackRoutes from './routes/feedbackRoutes.js';
app.use('/api/feedback', feedbackRoutes);

app.use('/', express.static(path.join(__dirname, '../frontend')));
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
