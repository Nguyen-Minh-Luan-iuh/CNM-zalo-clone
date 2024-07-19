import axios from 'axios';
import queryString from 'query-string';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosClient = axios.create({
	baseURL: 'http://localhost:5000/api',
	headers: {
		'Content-Type': 'application/json',
	},
	paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
	const token = await AsyncStorage.getItem('authorization');

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
