import { View, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage, setMessages } from '../../slide/MessageSlide';
import HeaderChat from '../chatView_onHome/HeaderChat';
import ChatInput from '../chatView_onHome/ChatInput';
import MessagesList from '../chatView_onHome/MessagesList';
import messageApi from '../../../api/messageApi';
import { useSocket } from '../../socketContext';

const ChatDetail = ({ navigation }) => {
	const socket = useSocket();
	const conversationDetails = useSelector(
		(state) => state.conservation?.conversationDetails
	);
	const profile = useSelector((state) => state.profile.profile);
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await messageApi.getMessages(
					conversationDetails?.conversationId
				);
				if (res && res.messages) {
					const updatedMessages = res.messages.map((message) => ({
						...message,
						isMyMessage: message.senderId === profile.userID,
					}));
					dispatch(setMessages(updatedMessages));
				}
			} catch (error) {
				console.error('Error fetching messages:', error);
			}
		};

		fetchData();

        const unsubscribe = navigation.addListener('focus', fetchData);

        return unsubscribe;
    }, [conversationDetails?.conversationId, profile.userID, dispatch, navigation]);

	useEffect(() => {
		if (socket) {
			const handleNewMessage = (newMessage) => {
				const updatedMessage = {
					...newMessage,
					isMyMessage: newMessage.senderId === profile.userID,
				};
				dispatch(addMessage(updatedMessage)); // Giả sử bạn có action addMessage
			};

			socket.on('newMessage', handleNewMessage);

			return () => {
				socket.off('newMessage', handleNewMessage);
			};
		}
	}, [socket, dispatch, profile.userID]);

	return (
		<View style={styles.container}>
			<HeaderChat navigation={navigation} />
			<View style={styles.messageScreenContainer}>
				<MessagesList />
			</View>
			<ChatInput />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	messageScreenContainer: {
		flex: 1,
	},
});

export default ChatDetail;
