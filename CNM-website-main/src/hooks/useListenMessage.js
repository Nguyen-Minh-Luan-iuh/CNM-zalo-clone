import React, { useContext, useEffect } from 'react';
import { useSocketContext } from '../context/SocketContext';
import { useConversation } from '../context/ConversationToken';
import { ConversationToken } from '../context/ConversationToken';

const useListenMessage = () => {
	const { socket } = useSocketContext();
	const { messages, setMessages } = useConversation();
	const { setHaveNewMessageConversations, conversationSelected } = useContext(ConversationToken);

	useEffect(() => {
		socket?.on('newMessage', (newMessage) => {
			console.log(newMessage);
			if(messages && conversationSelected.conversationId === newMessage.conversationId){
				setMessages((prevMessages) => [...prevMessages, newMessage]);
				setHaveNewMessageConversations((prev) => prev ? [...prev, {conversationId: newMessage.conversationId, message: newMessage}] : [{conversationId: newMessage.conversationId, message: newMessage}])
			} else {
				setHaveNewMessageConversations((prev) => prev ? [...prev, {conversationId: newMessage.conversationId, message: newMessage}] : [{conversationId: newMessage.conversationId, message: newMessage}])
			}
		});

		socket?.on('recallMessage', (updatedMessage) => {
			if(messages && conversationSelected.conversationId === updatedMessage.conversationId){
				const updatedMessages = messages.map(message => {
					if (message.messageId === updatedMessage.messageId) {
						// Cập nhật trạng thái của message
						message.isRecalled = true;
					}
					return message;
				});
				
				// Cập nhật state của messages
				setMessages(updatedMessages);
				setHaveNewMessageConversations((prev) => prev ? [...prev, {conversationId: updatedMessage.conversationId, message: updatedMessage}] : [{conversationId: updatedMessage.conversationId, message: updatedMessage}])
			} else {
				setHaveNewMessageConversations((prev) => prev ? [...prev, {conversationId: updatedMessage.conversationId, message: updatedMessage}] : [{conversationId: updatedMessage.conversationId, message: updatedMessage}])
			}
		});

		return () => {
			socket?.off('newMessage');
			socket?.off('recallMessage');
		}
	}, [socket, setMessages, messages]);
};

export default useListenMessage;
