import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const handleFunc = async (req, res) => {};

// @desc    Register a new user
// @route   /api/users
// @access  Public

export const registerUser = async (req, res) => {
	const { name, email, password } = req.body;

	// Validation
	if (!name || !email || !password) {
		res.status(400);
		throw new Error('Please include all fields');
	}

	// Find if user already exists
	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(400);
		throw new Error('User already exists');
	}

	// Hash password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	// Create user
	const user = await User.create({
		name,
		email,
		password: hashedPassword,
	});

	if (!user) {
		res.status(400);
		throw new Error('Invalid user data');
	}

	// Generate token
	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
		expiresIn: '30d',
	});

	res.status(201).json({
		_id: user._id,
		name: user.name,
		email: user.email,
		token,
	});
};

// @desc    Login a user
// @route   /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (!user) {
			res.status(401);
			throw new Error('Invalid user data');
		}

		// Check user and passwords match
		const checkPw = await bcrypt.compare(password, user.password);

		if (!checkPw) {
			res.status(401);
			throw new Error('Invalid password');
		}

		if (checkPw) {
			const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
				expiresIn: '30d',
			});

			res.status(200).json({
				_id: user._id,
				name: user.name,
				email: user.email,
				token,
			});
		}
	} catch (error) {
		res.json({ msg: error.message });
	}
};
