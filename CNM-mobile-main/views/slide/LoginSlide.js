import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	authorization: null,
	isLogin: false,
};

const LoginSlide = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setAuthorization: (state, action) => {
			state.authorization = action.payload;
		},
		setIsLogin: (state, action) => {
			state.isLogin = action.payload;
		},
	},
});

export const { setAuthorization, setIsLogin } = LoginSlide.actions;

export const selectAuthorization = (state) => state.auth.authorization;

export default LoginSlide.reducer;
