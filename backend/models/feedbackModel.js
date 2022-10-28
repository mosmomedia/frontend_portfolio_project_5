import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		rating: {
			type: Number,
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model('Feedback', feedbackSchema);
