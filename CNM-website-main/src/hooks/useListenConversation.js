import { useContext, useEffect } from 'react';
import { useSocketContext } from '../context/SocketContext';
import { useConversation } from '../context/ConversationToken';
import { ConversationToken } from '../context/ConversationToken';
import { useAuth } from '../context/AuthToken';

const useListenConversation = () => {
	const { socket } = useSocketContext();
    const { messages, setMessages } = useConversation();
	const { user } = useAuth();
	const { setNewConversation, setConversations, conversationSelected, setConversationSelected, setHaveNewMessageConversations, setToggleConversationInfo, conversations } = useContext(ConversationToken);

	useEffect(() => {
		socket?.on('newConversation', (newConversation) => {
            setNewConversation(newConversation)
		});

        socket?.on('deleteConversation', (conversationId) => {
            if(conversationSelected?.conversationId === conversationId){
                setMessages(null)
				setToggleConversationInfo({toggle: false, level: 0})
				setConversationSelected(null)
            }
            setConversations((prev) => (prev.filter(conversation => conversation.conversationId !== conversationId)))
		});

		socket?.on('addMemberIntoConversation', (resData) => {
            if(conversationSelected?.conversationId === resData.conversationId){
				let updatedParticipantIds = conversationSelected.participantIds.filter(participantId => !resData.addedParticipantIds.includes(participantId.participantId))
                updatedParticipantIds.push(...resData.addedParticipantIds)
                conversationSelected.membersInfo.push(...resData.membersInfo)
                conversationSelected.participantIds = updatedParticipantIds
                setConversationSelected((prev) => ({...conversationSelected}))
                setMessages((prevMessages) =>
                    prevMessages ? [...prevMessages, ...resData.messages] : [...resData.messages]
                );
                setHaveNewMessageConversations([{conversationId: conversationSelected.conversationId, message: resData.messages[resData.messages.length -1]}])
            } else {
                setHaveNewMessageConversations([{conversationId: resData.conversationId, message: resData.messages[resData.messages.length -1]}])
			}
		});

		socket?.on('removeMemberOutOfConversation', (resData) => {
            if(conversationSelected?.conversationId === resData.conversationId){
				if(user.userID !== resData.RemovedUserId){
					conversationSelected.membersInfo = conversationSelected.membersInfo.filter(member => {
						return member.userID !== resData.RemovedUserId
					})
					conversationSelected.participantIds = conversationSelected.participantIds.filter(participantId => participantId.participantId !==  resData.RemovedUserId)
					setConversationSelected((prev) => ({...conversationSelected}))
					setMessages((prevMessages) =>
						prevMessages ? [...prevMessages, resData.savedMessage] : [resData.savedMessage]
					);
					setHaveNewMessageConversations([{conversationId: conversationSelected.conversationId, message: resData.savedMessage}])
				} else {
					setToggleConversationInfo({toggle: false, level: 0})
					setMessages(null)
					setConversationSelected(null)
					setConversations((prev) => (prev.filter(conversation => conversation.conversationId !== resData.conversationId)))
				}
            } else {
				if(user.userID !== resData.RemovedUserId){
					setHaveNewMessageConversations([{conversationId: resData.conversationId, message: resData.savedMessage}])
				} else {
					setConversations((prev) => (prev.filter(conversation => conversation.conversationId !== resData.conversationId)))
				}
			}
		});

		socket?.on('changeOwnerOfConversation', (resData) => {
            if(conversationSelected?.conversationId === resData.conversationId){
				conversationSelected.participantIds = resData.participantIds
				conversationSelected.membersInfo = resData.membersInfo
				setConversationSelected((prev) => ({...conversationSelected}))
				setMessages((prevMessages) =>
					prevMessages ? [...prevMessages, resData.savedMessage] : [resData.savedMessage]
				);
				setHaveNewMessageConversations([{conversationId: conversationSelected.conversationId, message: resData.savedMessage}])
            } else {
				setHaveNewMessageConversations([{conversationId: resData.conversationId, message: resData.savedMessage}])
			}
		});

		socket?.on('leaveConversation', (resData) => {
            if(conversationSelected?.conversationId === resData.conversationId){
				conversationSelected.membersInfo = resData.membersInfo
				conversationSelected.participantIds = resData.updatedParticipantIds
				setConversationSelected((prev) => ({...conversationSelected}))
				setMessages((prevMessages) =>
					prevMessages ? [...prevMessages, ...resData.savedMessages] : [...resData.savedMessages]
				);
				setHaveNewMessageConversations([{conversationId: conversationSelected.conversationId, message: resData.savedMessages[resData.savedMessages.length -1]}])
            } else {
				setHaveNewMessageConversations([{conversationId: resData.conversationId, message: resData.savedMessages[resData.savedMessages.length -1]}])
			}
		});

		socket?.on('updateConversationAfterAcceptingAddFriend', (data) => {
			const isExistedConversation = conversations.some(conversation => conversation.conversationId === data.conversation.conversationId)
			console.log("conversation", conversations)
            if(!isExistedConversation) {
				setNewConversation(data.conversation)
				setHaveNewMessageConversations([{conversationId: data.conversation.conversationId, message: data.savedMessage}])
            } else {
				if(conversationSelected?.conversationId === data.conversation.conversationId){
					conversationSelected.membersInfo = data.conversation.membersInfo
					conversationSelected.participantIds = data.conversation.participantIds
					setConversationSelected((prev) => ({...conversationSelected}))
					setMessages((prevMessages) =>
						prevMessages ? [...prevMessages, data.savedMessage] : [data.savedMessage]
					);
					setHaveNewMessageConversations([{conversationId: conversationSelected.conversationId, message: data.savedMessage}])
				} else {
					setHaveNewMessageConversations([{conversationId: data.conversation.conversationId, message: data.savedMessage}])
				}
			}
		});

		return () => {
			socket?.off('newConversation');
			socket?.off('deleteConversation');
			socket?.off('addMemberIntoConversation');
			socket?.off('removeMemberOutOfConversation');
			socket?.off('changeOwnerOfConversation');
			socket?.off('leaveConversation');
			socket?.off('updateConversationAfterAcceptingAddFriend');
		}
	}, [socket, setMessages, messages, user]);
};

export default useListenConversation;
