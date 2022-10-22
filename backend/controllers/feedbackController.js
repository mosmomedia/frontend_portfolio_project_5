import Feedback from '../models/feedbackModel.js';

export const handleFunc = async (req, res) => {};

//@ get all feedback
//@ GET /api/feedback
//@ Public

export const getAllfeedbacks = async (req, res) => {
	const allFeedbacks = await Feedback.find();
	res.status(200).json(allFeedbacks);
};

//@ Post a feedback
//@ POST /api/feedback
//@ Private

export const postFeedback = async (req, res) => {
	const { rating, text, name } = req.body;
	// const { name } = req.user;

	const feedback = await Feedback.create({
		rating,
		text,
		userName: name,
		// userRef: uid,
	});

	res.status(200).json(feedback);
};
