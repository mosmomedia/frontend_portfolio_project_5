import express from 'express';

const router = express.Router();

import {
	getAllfeedbacks,
	postFeedback,
	deleteFeedback,
} from '../controllers/feedbackController.js';

router.route('/').get(getAllfeedbacks).post(postFeedback);
router.route('/:id').delete(deleteFeedback);

export default router;
