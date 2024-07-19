import { createContext, useContext, useEffect, useState } from 'react';
import { AuthToken } from './AuthToken';
import io from 'socket.io-client';

export const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { user } = useContext(AuthToken);

	useEffect(() => {
		if (user) {
			const socket = io('http://localhost:5000', {
				query: {
					userId: user.userID,
				},
			});
			setSocket(socket);

			socket.on('getOnlineUsers', (users) => {
				setOnlineUsers(users.filter((_user) => _user !== user.userID));
			});
			return () => socket.close();
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [user]);
	return (
		<SocketContext.Provider value={{ socket, onlineUsers }}>
			{children}
		</SocketContext.Provider>
	);
};
