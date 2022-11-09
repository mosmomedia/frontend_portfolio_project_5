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

if (process.env.NODE_ENV === 'production') {
	// production
	// app.use('/', express.static(path.join(__dirname)));
	pp.use(express.static('../dist'));
	app.get('*', (_, res) => {
		// res.sendFile(__dirname + '/index.html');
		res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
	});
} else {
	development;
	app.use('/', express.static(path.join(__dirname, '../frontend')));
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
	});
}

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
