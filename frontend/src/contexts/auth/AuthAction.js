const API_URL = 'api/auth/';

// Login user
export const loginUser = async (userData) => {
	const res = await axios.post(API_URL + 'login', userData);
	console.log(res);
	// localStorage.setItem('user', JSON.stringify(res.data));

	// return res.data;
};
