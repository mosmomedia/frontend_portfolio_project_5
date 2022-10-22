const API_URL = 'api/feedback/';

//  get all feedback
export const getAllFeedbacks = async () => {
	try {
		const res = await axios.get(API_URL);
		return res.data;
	} catch (error) {
		console.log(error);
	}
};
