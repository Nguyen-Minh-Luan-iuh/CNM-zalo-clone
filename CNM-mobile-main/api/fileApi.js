import axiosClient from './axiosClient';

const fileApi = {
	getFileBuffer: (fileName) => {
		const url = `/file/${fileName}`;
		return axiosClient.get(url);
	}
};

export default fileApi;
