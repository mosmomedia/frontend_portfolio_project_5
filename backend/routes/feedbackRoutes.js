import express from 'express';

const router = express.Router();

import {
	getAllfeedbacks,
	postFeedback,
	deleteFeedback,
	updateFeedback,
} from '../controllers/feedbackController.js';

router.route('/').get(getAllfeedbacks).post(postFeedback);
router.route('/:id').put(updateFeedback).delete(deleteFeedback);

export default router;
