import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import socketService from '../utils/socketService';
const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const profile = useSelector((state) => state.profile.profile);

	useEffect(() => {
		if (profile) {
			socketService.initialize(profile.userID); // Cập nhật với userId cần thiết
			setSocket(socketService.socket);
		}

		return () => {
			// Dọn dẹp khi unmount
			socketService.disconnect();
		};
	}, [profile]);

	return (
		<SocketContext.Provider value={socket}>
			{children}
		</SocketContext.Provider>
	);
};
