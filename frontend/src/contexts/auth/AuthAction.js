const API_URL = 'api/auth/';

// Login user
export const loginUser = async (userData) => {
	try {
		const res = await axios.post(API_URL + 'login', userData);
		localStorage.setItem('user', JSON.stringify(res.data));
		return { success: true, data: res.data };
	} catch (error) {
		return { success: false, data: error.response.data };
	}
};

// Sigin up user

export const registerUser = async (userData) => {
	try {
		const res = await axios.post(API_URL, userData);
		localStorage.setItem('user', JSON.stringify(res.data));
		return { success: true, data: res.data };
	} catch (error) {
		return { success: false, data: error.response.data };
	}
};
