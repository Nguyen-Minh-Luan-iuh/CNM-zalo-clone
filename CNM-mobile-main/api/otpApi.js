import axiosClient from "./axiosClient";

const otpApi = {
	sendOTP: (phoneNumber) => {
		const url = '/otp/send-otp';
		return axiosClient.post(url, { phoneNumber });
	},
    verifyOTP: (phoneNumber, otp) => {
		const url = '/otp/verify-otp';
		return axiosClient.post(url, { phoneNumber, otp });
	}
};

export default otpApi;