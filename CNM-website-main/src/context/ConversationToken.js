import React, { createContext, useContext, useEffect, useState } from 'react';
import messageApi from '../api/messageApi';
import conversationApi from '../api/conversationApi';

export const ConversationToken = createContext();

export const useConversation = () => {
	return useContext(ConversationToken);
};

const ConversationProvide = ({ children }) => {
	const [conversationSelected, setConversationSelected] = useState(null);
	const [conversations, setConversations] = useState([]);
	const [haveNewMessageConversations, setHaveNewMessageConversations] = useState([])
	const [newConversation, setNewConversation] = useState('')
	const [messages, setMessages] = useState(null);
	const [toggleConversationInfo, setToggleConversationInfo] = useState({})

	useEffect(() => {
		const fetchConversations = async () => {
			try {
				const res = await conversationApi.getConversations();
				setConversations(res.conversations);
			} catch (error) {
				console.log(error);
			}
		};
		fetchConversations();
	}, [haveNewMessageConversations, newConversation]);

	useEffect(() => {
		const fetchMessages = async () => {
			try {
				if (conversationSelected) {
					const res = await messageApi.getMessages(
						conversationSelected.conversationId
					);
					setMessages(res.messages);
				}
			} catch (error) {
				console.log('Error fetching message');
			}
		};
		fetchMessages();
	}, [conversationSelected]);

	return (
		<ConversationToken.Provider
			value={{
				conversationSelected,
				setConversationSelected,
				conversations,
				setConversations,
				messages,
				setMessages,
				haveNewMessageConversations,
				setHaveNewMessageConversations,
				setNewConversation,
				toggleConversationInfo,
				setToggleConversationInfo
			}}
		>
			{children}
		</ConversationToken.Provider>
	);
};

export default ConversationProvide;
