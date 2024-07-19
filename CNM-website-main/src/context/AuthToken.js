import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

import authApi from '../api/authApi';

export let AuthToken = createContext();

export const useAuth = () => {
	return useContext(AuthToken);
};

const AuthProvide = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isFetchingUser, setIsFetchingUser] = useState(true);

	const login = async (data) => {
		try {
			const res = await authApi.signInWithPhone(data);
			if (res?.headers.authorization) {
				Cookies.set('authorization', res.headers.authorization);
				const response = await authApi.secret();
				if (response.user) {
					setUser(response.user);
				}
			}
			return res;
		} catch (error) {
			throw error;
		}
	};
	const logout = () => {
		Cookies.set('authorization', null);
		setUser(null);
	};
	const secret = async () => {
		try {
			const res = await authApi.secret();
			if (res.user) {
				setUser(res.user);
			}
		} catch (error) {
			console.log('Error fetching user: ', error);
		}
	};

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await authApi.secret();
				setUser(res.user);
			} catch (error) {
				console.error('Error fetching user:', error);
			} finally {
				setIsFetchingUser(false);
			}
		};

		if (Cookies.get('authorization')) {
			fetchUser();
		} else {
			setIsFetchingUser(false);
		}
	}, []);

	return (
		<AuthToken.Provider
			value={{ user, isFetchingUser, login, logout, secret, setUser }}
		>
			{children}
		</AuthToken.Provider>
	);
};

export default AuthProvide;
