import axiosClient from './axiosClient';

const userApi = {
	findUser: (phoneNumber) => {
		const url = '/user/find-user';
		return axiosClient.get(url, { params: { phoneNumber } });
	},
	changePassword: async (newPassword, phoneNumber) => {
		const url = '/user/change-password';
	
		const data = {
			newPassword: newPassword,
			phoneNumber: phoneNumber
		};
		return axiosClient.put(url, data);
	},

	updateAvatar: (file) => {
		const url = '/user/update-profile-pic';
		const config = {
			headers: {
				'content-type': 'multipart/form-data',
			},
		};
		let formData = new FormData();
		formData.append('profilePic', file);
		return axiosClient.patch(url, formData, config);
	},
	updateInfo: (data) => {
		const url = '/user/update-info';
		return axiosClient.put(url, data);
	},
	updatePassword: (currentPassword, newPassword) => {
		const data = { currentPassword, newPassword };
		const url = '/user/update-password';
		return axiosClient.patch(url, data);
	},
	addFriend: (userId, friendId) => {
		const data = { userId, friendId };
		const url = '/user/add-friend';
		return axiosClient.put(url, data);
	},
	sentRequestAddFriend: (userId, friendId) => {
		const data = { userId, friendId };
		const url = '/user/sent-request-add-friend';
		return axiosClient.put(url, data);
	},

	inFoUser: (userId) => {
		const url = '/user/info-user';
		return axiosClient.get(url, { params: { userId } });
	},

	findUserById: (userId) => {
		const url = '/user/find-user-by-id/' + userId;
		return axiosClient.get(url, { params: { userId } });
	},
	cancelRequestAddFriends: (userId, userRequestedId) => {
		const data = {userId, userRequestedId};
		console.log('data', data)
		const url = '/user/cancel-request-add-friend';
		return axiosClient.put(url, data);
	},
	cancelFriend: (userId, friendId) => {
		const data = { userId, friendId };
		const url = '/user/cancel-friend';
		return axiosClient.put(url, data);
	},
	deleteFriend: (userId, friendId) => {
		const data = { userId, friendId };
		const url = '/user/delete-friend';
		return axiosClient.put(url, data);
	},
	getAllFriendsWithConversationId: () => {
		const url = '/user/get-all-friends-with-conversationid';
		return axiosClient.get(url);
	},
};

export default userApi;
