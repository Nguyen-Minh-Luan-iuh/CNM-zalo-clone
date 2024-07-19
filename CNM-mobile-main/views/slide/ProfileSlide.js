import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	profile: null,
	loading: false,
	error: '',
};

const ProfileSlice = createSlice({
	name: 'profile',
	initialState,
	reducers: {
		readProfile: (state, action) => {
			state.profile = action.payload;
			state.loading = false;
			state.error = '';
		},
		clearProfile: (state) => {
			state.profile = null;
			state.loading = false;
			state.error = '';
		},
		updateProfileStart: (state) => {
			state.loading = true;
		},
		updateProfileSuccess: (state, action) => {
			state.profile = action.payload;
			state.loading = false;
			state.error = '';
		},
		updateProfileFailure: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
	},
});

export const { readProfile, clearProfile, updateProfileStart, updateProfileSuccess, updateProfileFailure } = ProfileSlice.actions;
export const setProfile = (state) => state.profile.profile;
export const selectUserId = (state) => state.profile.profile?.userID;
export default ProfileSlice.reducer;
