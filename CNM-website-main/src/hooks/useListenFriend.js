import { useContext, useEffect } from 'react';
import { useSocketContext } from '../context/SocketContext';
import { useAuth } from '../context/AuthToken';

const useListenFriend = () => {
	const { socket } = useSocketContext();
	const { user, setUser } = useAuth();

	useEffect(() => {
		socket?.on('deleteFriend', (deletedUser) => {
            setUser(prevUser => ({
				...prevUser,
				friends: prevUser.friends.filter(friend => friend !== deletedUser)
			}));
		});

		socket?.on('addFriend', (userId) => {
            setUser(prevUser => ({
				...prevUser,
				listRequestAddFriendsReceived: [...(prevUser.listRequestAddFriendsReceived || []), userId]
			}));
		});

		socket?.on('cancelAddFriend', (userId) => {
            setUser(prevUser => ({
				...prevUser,
				listRequestAddFriendsReceived: prevUser.listRequestAddFriendsReceived.filter(friend => friend !== userId)
			}));
		});

		socket?.on('acceptAddFriend', (userId) => {
            setUser(prevUser => ({
				...prevUser,
				friends: [...(prevUser.friends || []), userId],
                listRequestAddFriendsSent: prevUser.listRequestAddFriendsSent.filter(friend => friend !== userId)
			}));
		});

		socket?.on('refuseAddFriend', (userId) => {
            setUser(prevUser => ({
				...prevUser,
                listRequestAddFriendsSent: prevUser.listRequestAddFriendsSent.filter(friend => friend !== userId)
			}));
		});

		return () => {
			socket?.off('deleteFriend');
			socket?.off('addFriend');
			socket?.off('cancelAddFriend');
			socket?.off('acceptAddFriend');
			socket?.off('refuseAddFriend');
		}
	}, [setUser, socket]);
};

export default useListenFriend;
