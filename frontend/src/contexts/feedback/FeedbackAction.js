const API_URL = 'api/feedback/';

//  get all feedback
export const getAllFeedbacks = async () => {
	try {
		const res = await axios.get(API_URL);
		return res.data;
	} catch (error) {
		return res.error;
	}
};

// create a feedback
export const postFeedback = async (formData) => {
	try {
		const res = await axios.post(API_URL, formData);
		return res.data;
	} catch (error) {
		console.log(error);
	}
};

//  update a feedback
export const updateFeedback = async (formData, id) => {
	try {
		const res = await axios.put(API_URL + id, formData);

		return res.data;
	} catch (error) {
		console.log(error);
	}
};

//  delete a feedback
export const deleteFeedback = async (id) => {
	try {
		if (window.confirm('Are you sure?')) {
			const res = await axios.delete(API_URL + id);
			return res.data;
		}
	} catch (error) {
		console.log(error);
	}
};
