import axios from 'axios';
import queryString from 'query-string';
import Cookies from 'js-cookie';

const axiosClient = axios.create({
	baseURL: 'http://localhost:5000/api',
	headers: {
		'Content-Type': 'application/json',
	},
	paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
	const token = Cookies.get('authorization');

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

axiosClient.interceptors.response.use(
	(res) => {
		if (res.headers.authorization) return res;
		else if (res && res.data) {
			return res.data;
		}
		return res;
	},
	(error) => {
		throw error;
	}
);

export default axiosClient;
