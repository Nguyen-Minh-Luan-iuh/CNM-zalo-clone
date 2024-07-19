import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	profile: null,
	listRequestAddFriendsSent: [],
	listRequestAddFriendsReceived: [],
	friends: [],
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setProfile: (state, action) => {
			state.profile = action.payload.profile;
		},
		setListRequestAddFriendsSent: (state, action) => {
			state.listRequestAddFriendsSent =
				action.payload.listRequestAddFriendsSent;
		},
		setListRequestAddFriendsReceived: (state, action) => {
			state.listRequestAddFriendsReceived =
				action.payload.listRequestAddFriendsReceived;
		},
		setFriends: (state, action) => {
			state.friends = action.payload.friends;
		},
		setSentRequests: (state, action) => {
			state.sentRequests = action.payload;
		},
		setReceivedRequests: (state, action) => {
			state.receivedRequests = action.payload;
		},
	},
});

export const {
	setSentRequests,
	setReceivedRequests,
	setProfile,
	setListRequestAddFriendsSent,
	setListRequestAddFriendsReceived,
	setFriends,
} = userSlice.actions;

export default userSlice.reducer;
