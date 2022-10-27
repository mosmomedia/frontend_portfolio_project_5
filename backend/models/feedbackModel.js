import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
	{
		userRef: {
			type: mongoose.Schema.Types.ObjectId,
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
		userName: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model('Feedback', feedbackSchema);
