import express from 'express';

const router = express.Router();

import {
	getAllfeedbacks,
	postFeedback,
} from '../controllers/feedbackController.js';

router.route('/').get(getAllfeedbacks).post(postFeedback);

export default router;
