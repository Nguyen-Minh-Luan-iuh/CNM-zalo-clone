import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { CiImageOn } from "react-icons/ci";
import { MdAttachFile } from "react-icons/md";
import { GrAnnounce } from "react-icons/gr";
import { AuthToken } from '../../context/AuthToken';
import { ConversationToken } from '../../context/ConversationToken';
import { useSocketContext } from '../../context/SocketContext';
import conversationApi from '../../api/conversationApi';

const WrapperStyled = styled.div`
	padding: 0.7rem 1rem;
	display: flex;
	align-items: center;
	justify-items: center;
	&:hover {
		cursor: pointer;
		background: var(--layer-background-hover);
	}
	&.active {
		background-color: var(--layer-background-selected);
	}
`;
const AvatarStyled = styled.div`
	height: 3.2rem;
	aspect-ratio: 1/1;
	border-radius: 50%;
	background-color: white;
	box-shadow: 0 0 4px 0.5px rgba(0, 0, 0, 0.05);
	position: relative;
	img {
		width: 100%;
		height: 100%;
		border-radius: 50%;

		object-fit: cover;
	}

	&.online::after {
		content: '';
		position: absolute;
		right: 3px;
		bottom: 2px;
		width: 0.675rem;
		height: 0.675rem;
		background-color: #7de07d;
		border-radius: 50%;
	}
`;
const InfoStyled = styled.div`
	height: 3.2rem;
	padding-left: 0.8rem;
	width: 60%;
	display: flex;
	flex-direction: column;
	align-items: start;
	flex: 1;
	justify-content: space-evenly;

	h6 {
		width: 100%;
		margin: 0;
		font-size: 1rem;
		font-weight: 400;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: var(--text-primary);
	}
	
	.last-message-info{
		max-width: 100%;
		color: var(--text-secondary);
		display: flex;
		align-items: center;
		
		.last-message-sender{
			font-size: 0.85rem;
			margin-right: 0.3rem;
		}

		.last-message-icon{
			margin-right: 0.2rem;
		}
		
		p {
			width: 14rem;
			font-size: 0.85rem;
			margin: 0;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
	
			img {
				width: 1.2rem;
				height: 1.2rem;
			}
		}
	}
`;
const Conversation = ({ conversation }) => {
	const { user } = useContext(AuthToken);
	const { onlineUsers } = useSocketContext();
	const { conversationSelected, setConversationSelected, messages, haveNewMessageConversations, toggleConversationInfo, setToggleConversationInfo } =
		useContext(ConversationToken);
	const [lastMessage, setLastMessage] = useState(conversation.lastMessage)
	const [haveNewMessage, setHaveNewMessage] = useState({})

	const title =
		conversation?.name ||
		conversation?.membersInfo?.find(
			(member) => member.userID !== user?.userID
		)?.fullName;
	const isOnline = conversation.participantIds.some((id) =>
		onlineUsers.includes(id.participantId)
	);

	const handlerConversation = () => {
		setToggleConversationInfo({toggle: toggleConversationInfo?.toggle, level: conversation.participantIds.length > 2 ? 0 : 2})
		setConversationSelected(conversation);
	};

	useEffect(() => {
		for(const haveNewMessageConversation of haveNewMessageConversations) {
			if(haveNewMessageConversation.conversationId === conversation.conversationId){
				setHaveNewMessage(haveNewMessageConversation.message)
			}
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [haveNewMessageConversations])

	useEffect(() => {
		getLastMessage()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[haveNewMessage])

	const getLastMessage = async () => {
		try {
            const res = await conversationApi.getLastMessage(conversation.conversationId);
            setLastMessage(res.lastMessage)
        } catch (error) {
            console.log(error)
        }
	}

	return (
		<WrapperStyled
			onClick={handlerConversation}
			className={
				conversation.conversationId ===
				conversationSelected?.conversationId
					? 'active'
					: ''
			}
		>
			<AvatarStyled className={isOnline ? 'online' : ''}>
				<img
					src={
						conversation?.avatar ||
						conversation?.membersInfo?.find(
							(member) => member.userID !== user?.userID
						)?.profilePic
					}
					alt=""
				/>
			</AvatarStyled>
			<InfoStyled>
				<h6>{title}</h6>
				<div className='last-message-info'>
					{lastMessage?.content && lastMessage?.senderId === user.userID && lastMessage?.type !== "notification" && (<span className='last-message-sender'>Bạn:</span>)}
					{
						lastMessage?.isRecalled ? (<p>Tin nhắn đã được thu hồi</p>)
						: lastMessage?.type === "like" ? (<p><img src={lastMessage?.content} alt=''/></p>) 
						: lastMessage?.type === "image" ? (<div className='d-flex align-items-center'><CiImageOn className='last-message-icon'/><p>Hình ảnh</p></div>)
						: lastMessage?.type === "file" ? (<div className='d-flex align-items-center'><MdAttachFile  className='last-message-icon'/><p>{lastMessage.content.split('.').slice(-2).join('.')}</p></div>)
						: lastMessage?.type === "notification" ? (<div className='d-flex align-items-center'><GrAnnounce  className='last-message-icon'/><p>{`${lastMessage?.senderId !== user.userID ? lastMessage.senderName : "Bạn"} ${lastMessage.content}`}</p></div>)
						: (<p>{lastMessage?.content || 'Chưa có tin nhắn'}</p>)
					}
				</div>
			</InfoStyled>
		</WrapperStyled>
	);
};

export default Conversation;
