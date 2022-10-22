import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
	{
		userRef: {
			type: mongoose.Schema.Types.ObjectId,
			required: false,
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
			required: false,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model('Feedback', feedbackSchema);
