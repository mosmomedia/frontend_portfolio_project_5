const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');

dotenv.config();
connectDB();

const app = express();

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
// feedback
app.use('/api/feedback', require('./routes/feedbackRoutes.js'));

// users
app.use('/api/auth', require('./routes/authRoutes.js'));

app.use('/', express.static(path.join(__dirname, '../frontend')));
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
