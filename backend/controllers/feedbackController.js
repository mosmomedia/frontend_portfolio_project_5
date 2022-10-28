import Feedback from '../models/feedbackModel.js';

export const handleFunc = async (req, res) => {};

//@ get all feedback
//@ GET /api/feedback
//@ Public

export const getAllfeedbacks = async (req, res) => {
	const allFeedbacks = await Feedback.find().populate({
		path: 'user',
		select: 'email name',
	});
	res.status(200).json(allFeedbacks);
};

//@ Post a feedback
//@ POST /api/feedback
//@ Private

export const postFeedback = async (req, res) => {
	const { rating, text, _id } = req.body;
	const newFeedback = await Feedback.create({
		rating,
		text,
		user: _id,
	});

	res.status(200).json(newFeedback);
};

//@ update a feedback
//@ PUT /api/feedback
//@ Private

export const updateFeedback = async (req, res) => {
	const { id } = req.params;
	if (!id) {
		res.status(400);
		throw new Error('ID not found ');
	}

	const feedback = await Feedback.findById(id);

	if (!feedback) {
		res.status(404);
		throw new Error('feedback not found');
	}

	const updatedFeedback = await Feedback.findByIdAndUpdate(id, req.body, {
		new: true,
	});

	res.status(200).json(updatedFeedback);
};

//@ Delete a feedback
//@ DELTE /api/feedback
//@ Private

export const deleteFeedback = async (req, res) => {
	const { id } = req.params;

	const feedback = await Feedback.findById(id);

	if (!feedback) {
		res.status(404);
		throw new Error('feedback not found');
	}

	await feedback.remove();

	res.status(200).json({ success: true });
};
