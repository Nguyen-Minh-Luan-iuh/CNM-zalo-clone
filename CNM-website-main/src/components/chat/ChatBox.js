/* eslint-disable array-callback-return */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import EmojiPicker from 'emoji-picker-react';
import { CiFileOn, CiImageOn } from "react-icons/ci";
import { LuSendHorizonal } from "react-icons/lu";
import { HiOutlineFaceSmile } from "react-icons/hi2";
import { IoCallOutline } from "react-icons/io5";
import { GoDeviceCameraVideo } from "react-icons/go";
import { toast, Toaster } from "react-hot-toast";
import { FaRegUser } from "react-icons/fa6";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { PiSquareHalfFill, PiSquareSplitHorizontal } from "react-icons/pi";

import { AuthToken } from '../../context/AuthToken';
import { ConversationToken } from '../../context/ConversationToken';
import messageApi from '../../api/messageApi';

import ChatImage from '../../assets/images/chat_image.jpg';
import LikeEmoji from '../../assets/images/like_emoji.svg';
import useListenMessage from '../../hooks/useListenMessage';
import MessageItem from './MessageItem';

const ChatBoxStyled = styled.div`
	width: calc(100% - 21.5rem);
`;
const HeaderChatStyled = styled.div`
	height: 68px;
	user-select: none;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 1.2rem;
	border-bottom: 1px solid var(--border);
`;

const UserInfoHeaderChatStyled = styled.div`
	height: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;

	img {
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		object-fit: cover;
		margin-right: 0.9rem;
	}

	.conversation-info{
		height: 100%;
		display: flex;
		justify-content: space-between;
		flex-direction: column;

		h5 {
			padding-top: 0.65rem;
			font-size: 1.1rem;
			font-weight: 600;
			margin: 0rem;
		}

		.conversation-members{
			padding-bottom: 0.65rem;
			display: flex;
			align-items: center;
			font-size: 0.9rem;
			cursor: pointer;

			span{
				padding-top: 0.2rem;
				margin-left: 0.3rem;
				font-size: 0.90rem;
			}

			&:hover{
				color: var(--text-information);
			}
		}
	}

`;

const ActionHeaderChatStyled = styled.div`
	.action-header-chat-icon {
		width: 2rem;
		height: 2rem;
		padding: 0.4rem;
		margin-left: 0.3rem;
		border-radius: 0.2rem;
		cursor: pointer;

		&:hover {
			background-color: var(--button-tertiary-neutral-hover);
		}

		&.add-friend-into-group-icon {
			padding: 0.3rem;
		}

		&.toggle-icon{
			padding: 0.3rem;

			&.on-toggle-icon{
				background-color: var(--button-tertiary-neutral-focus-bg);
				color: var(--button-tertiary-neutral-focus-text);
			}
		}
	}
`;

const ContentChatStyled = styled.div`
	height: calc(100vh - 160.8px);
	overflow-y: auto;
	padding: 1rem;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	background-color: #eef0f1;

	/* Ẩn thanh cuộn cho các trình duyệt Chrome */
	&::-webkit-scrollbar {
		display: none;
	}

	/* Tùy chỉnh thanh cuộn cho các trình duyệt khác */
	scrollbar-width: none; /* Ẩn thanh cuộn */
	-ms-overflow-style: none; /* Ẩn thanh cuộn cho IE/Edge */

	.chat-time {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;

		span {
			font-size: 0.8rem;
			color: white;
			background-color: rgba(0, 0, 0, 0.2);
			padding: 0.2rem 0.8rem;
			border-radius: 0.6rem;
		}
	}
`;
const SendMessageInputStyled = styled.div`
	height: 92.8px;
	border-top: 1px solid var(--color-60);
`;
const SendMediaStyled = styled.div`
	display: flex;
	align-items: center;
	height: 44%;
	padding: 0 0.5rem;

	> * {
		width: 2rem;
		height: 2rem;
		padding: 0.3rem;
		margin: 0 0.3rem;
		border-radius: 0.2rem;
		color: var(--button-neutral-text);

		&:hover {
			background-color: var(--button-tertiary-neutral-hover);
			cursor: pointer;
		}
	}
`;
const InputMessageStyled = styled(Row)`
	display: flex;
	height: 56%;
	align-items: center;
	border-top: 1px solid var(--border);
	padding: 0 0.4rem 0 0;

	&:has(input:focus) {
		border-top: 1px solid var(--border-focused);
	}

	input {
		padding: 0 1rem;
		width: 100%;
		height: 3rem;
		border: none;
		outline: none;
		font-size: 0.96rem;
		color: var(--text-primary);
	}
`;
const SendIconStyled = styled.div`
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	
	.send-icon {
		border-radius: 0.2rem;
		color: var(--button-tertiary-primary-text); 
		width: 2rem;
		height: 2rem;
		padding: 0.3rem;

		&:hover {
			background-color: #e5efff;
		}
	}

	.like-icon {
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 0.2rem;
		color: var(--button-tertiary-primary-text); 
		width: 2rem;
		height: 2rem;
		padding: 0.3rem;

		&:hover {
			background-color: var(--button-tertiary-neutral-hover);
		}
	}
`;
const ImojiIconStyled = styled.div`
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	margin-right: 0.3rem;

	
	.emoji-icon {
		border-radius: 0.2rem;
		color: var(--button-neutral-text);
		width: 2rem;
		height: 2rem;
		padding: 0.2rem;

		&:hover {
			background-color: var(--button-tertiary-neutral-hover);
		}

		&.clicked {
			background-color: #e5efff;
			color: var(--button-tertiary-primary-text); 
		}
	}

	.emoji-picker {
		position: absolute; 
		bottom: 2.6rem; 
		right: 3rem;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
		border-radius: 0.3rem;
	}
`;
const ActionStyled = styled.div`
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`;
const NoneConversationStyled = styled.div`
	width: 100%;
	height: 100vh;
	padding: 2rem;

	display: flex;
	justify-content: center;
	align-items: center;

	img {
		width: 100%;
		max-width: 35rem;
		height: 100%;
		object-fit: contain;
	}
`;

const ChatBox = () => {
	const [newMessage, setNewMessage] = useState("");
	const [emojiPicker, setEmojiPicker] = useState(false)
    const [elementShowTippy, setElementShowTippy] = useState('');
	useListenMessage();
	const { user } = useContext(AuthToken);
	const { conversationSelected, messages, setMessages, setHaveNewMessageConversations, toggleConversationInfo, setToggleConversationInfo } =
	useContext(ConversationToken);
	const contentChatRef = useRef()

	const handleChangeMessage = (e) => {
		if(!e.target.value.startsWith(' ')){
			setNewMessage(e.target.value)
		}
	}

	const handleChooseImage = () => {
		let input = document.createElement('input');
		input.type = 'file';
		input.accept = "image/*"
		input.multiple = true
		input.click();
		input.onchange = async e => { 
			let files = e.target.files;
			let data = new FormData()
			if (files.length !== 0) {
				for (const single_file of files) {
					data.append('file', single_file)
				}
				data.append('conversationId', conversationSelected.conversationId)
				data.append('type', "image")
			}
			try {
				const res = await messageApi.sendMessage(data);
				setMessages((prevMessages) =>
					prevMessages ? [...prevMessages, ...res.message] : [...res.message]
				);
				setHaveNewMessageConversations([{conversationId: conversationSelected.conversationId, message: res.message[res.message.length -1]}])
			} catch (error) {
				if(error?.response && error?.response.status === 500){
					toast.error("Vui lòng chọn ảnh có kích thước không quá 4MB.")
				}
			} finally {
				setNewMessage("")
			}
		}
	}

	const handleChooseFile = () => {
		let input = document.createElement('input');
		input.type = 'file';
		input.accept = "application/*, text/*, video/*"
		input.multiple = true
		input.click();
		input.onchange = async e => { 
			let files = e.target.files;
			let data = new FormData()
			if (files.length !== 0) {
				for (const single_file of files) {
					data.append('file', single_file)
				}
				data.append('conversationId', conversationSelected.conversationId)
				data.append('type', "file")
			}
			try {
				const res = await messageApi.sendMessage(data);
				setMessages((prevMessages) =>
					prevMessages ? [...prevMessages, ...res.message] : [...res.message]
				);
				setHaveNewMessageConversations([{conversationId: conversationSelected.conversationId, message: res.message[res.message.length -1]}])
			} catch (error) {
				if(error?.response && error?.response.status === 500){
					toast.error("Vui lòng chọn file có kích thước không quá 4MB.")
				}
			} finally {
				setNewMessage("")
			}
		}
	}

	const handlerSendButton = async () => {
		if(newMessage.trim() !== ""){
			try {
				const res = await messageApi.sendMessage({
					content: newMessage,
					conversationId: conversationSelected.conversationId,
					type: "text"
				});
				setMessages((prevMessages) =>
					prevMessages ? [...prevMessages, ...res.message] : [...res.message]
				);
				setHaveNewMessageConversations([{conversationId: conversationSelected.conversationId, message: res.message[res.message.length -1]}])
			} catch (error) {
				console.log(error);
			} finally {
				setNewMessage("")
			}
		}
	};

	const handleOnScrollChatContent = () => {
		if(elementShowTippy !== '') {
            setElementShowTippy('')
        }
	}

	const showEmojiPicker = () => {
		const emojiIcon = document.querySelector('.emoji-icon')
		if(emojiIcon){
			emojiIcon.classList.add('clicked');
		}
		setEmojiPicker(true)
	}

	const hideEmojiPicker = () => {
		const emojiIcon = document.querySelector('.emoji-icon')
		if(emojiIcon){
			emojiIcon.classList.remove('clicked');
		}
		setEmojiPicker(false)
	}

	const handleClickEmojiIcon = (e) => {
        e.stopPropagation();

		if(emojiPicker === false) {
			showEmojiPicker()
		} else {
			hideEmojiPicker()
		}

		if(elementShowTippy !== '') {
            setElementShowTippy('')
        }
	}

	window.addEventListener("click", (e) => {
		if (!e.target.closest(".emoji-picker") && emojiPicker === true) {	
			hideEmojiPicker()
		} 
		if(elementShowTippy !== '') {
            setElementShowTippy('')
        }
    });

	const handlePressEnter = (e) => {
		if (e.charCode === 13 && e.code === 'Enter') {
            handlerSendButton();
			if(emojiPicker === true) {
				hideEmojiPicker()
			}
        }
	}

	const handleClickEmojiItem = (e) => {
		const sendMessageInput = document.querySelector(".send-message-input")
		sendMessageInput.focus()
		setNewMessage((newMessage) => newMessage + e.emoji)
	}

	const handleClickLike = async () => {
		let blob = null;
		let xhr = new XMLHttpRequest(); 
		xhr.open("GET", './assets/like_emoji.svg'); 
		xhr.responseType = "blob";//force the HTTP response, response-type header to be blob
		xhr.onload = async () => {
			blob = xhr.response;//xhr.response is now a blob object
			let file = new File([blob], 'like_emoji.svg', {type: 'image/svg+xml', lastModified: Date.now()});
			let data = new FormData()
			data.append('file', file)
			data.append('conversationId', conversationSelected.conversationId)
			data.append('type', "like")
		
			try {
				const res = await messageApi.sendMessage(data);
				setMessages((prevMessages) =>
					prevMessages ? [...prevMessages, ...res.message] : [...res.message]
				);
			} catch (error) {
				console.log(error);
			} finally {
				setNewMessage("")
			}
		}
		xhr.send()
	}

	useEffect(() => {
		if (contentChatRef.current) {
			contentChatRef.current.scrollTop = contentChatRef.current.scrollHeight;
		}
	}, [messages]);

	return (
		<>
			{messages ? (
				<ChatBoxStyled>
					<Toaster toastOptions={{ duration: 4000 }}/>
					<HeaderChatStyled>
						<UserInfoHeaderChatStyled>
							<img 
								src={
									conversationSelected?.avatar ||
									conversationSelected?.membersInfo?.find(
									(member) => member.userID !== user?.userID
								)?.profilePic} 
								alt=''
							/>
							<div className={conversationSelected.participantIds.length > 2 ? 'conversation-info' : 'conversation-info pt-1'}>
								<h5>
									{conversationSelected?.name ||
										conversationSelected?.membersInfo?.find(
											(member) => member.userID !== user?.userID
										)?.fullName}
								</h5>
								{conversationSelected.participantIds.length > 2 && (
									<div className='conversation-members' onClick={() => setToggleConversationInfo({toggle: true, level: 1})}>
										<FaRegUser />
										<span>{conversationSelected?.participantIds.length} thành viên</span>
									</div>
								)}
							</div>
						</UserInfoHeaderChatStyled>
						<ActionHeaderChatStyled>
							{conversationSelected.participantIds.length > 2 && <AiOutlineUsergroupAdd className='action-header-chat-icon add-friend-into-group-icon'/>}
							<IoCallOutline className='action-header-chat-icon'/>
							<GoDeviceCameraVideo className='action-header-chat-icon'/>
							{toggleConversationInfo?.toggle ? (
								<PiSquareHalfFill className='action-header-chat-icon toggle-icon on-toggle-icon' onClick={() => setToggleConversationInfo({toggle: false, level: 0})}/>
							) : (
								<PiSquareSplitHorizontal className='action-header-chat-icon toggle-icon' onClick={() => setToggleConversationInfo({toggle: true, level: conversationSelected.participantIds.length > 2 ? 0 : 2})}/>
							)}
						</ActionHeaderChatStyled>
					</HeaderChatStyled>
					<ContentChatStyled ref={contentChatRef} onScroll={() => handleOnScrollChatContent()}>
						{messages.map((message, index, arr) => (
							<>
								{
									!message.deletedUserIds?.includes(user.userID) && ((arr[index-1] && new Date(message.createdAt).getTime() - new Date(arr[index-1].createdAt).getTime() > 1800000) || !arr[index-1])
									? 
									<div className='chat-time'>
										<span>
											{`
												${new Date(message.createdAt).getHours().toString().padStart(2, '0')}:${new Date(message.createdAt).getMinutes().toString().padStart(2, '0')} 
												${new Date(message.createdAt).getDate().toString().padStart(2, '0')}/${(new Date(message.createdAt).getMonth() + 1).toString().padStart(2, '0')}/${new Date(message.createdAt).getFullYear()}
											`}
										</span>
									</div>
									: null 
								}
								<MessageItem setHaveNewMessageConversations={setHaveNewMessageConversations} messages={messages} setMessages={setMessages} elementShowTippy={elementShowTippy} setElementShowTippy={setElementShowTippy} hideEmojiPicker={emojiPicker ? hideEmojiPicker : null} user={user} message={message} index={index} arr={arr}/>
							</>
						))}
					</ContentChatStyled>
					<SendMessageInputStyled>
						<SendMediaStyled className="g-0">
							<CiImageOn onClick={() => handleChooseImage()}/>
							<CiFileOn onClick={() => handleChooseFile()}/>
						</SendMediaStyled>
						<InputMessageStyled className="g-0">
							<Col md={11}>
								<input
									className='send-message-input'
									value={newMessage}
									onChange={(e) => handleChangeMessage(e)}
									placeholder="Nhập tin nhắn để gửi"
									onKeyPress={(e) => handlePressEnter(e)}
								/>
							</Col>
							<Col md={1} sm={4}>
								<ActionStyled>									
									<ImojiIconStyled>
										{!emojiPicker ? (
												<HiOutlineFaceSmile className='emoji-icon' onClick={(e) => handleClickEmojiIcon(e)} />
											) : (
												<>
													<HiOutlineFaceSmile 
														className='emoji-icon'
														onClick={(e) => handleClickEmojiIcon(e)}
													/>
													<EmojiPicker
														searchDisabled="true"
														previewConfig={{ showPreview: false }}
														onEmojiClick={(e) => handleClickEmojiItem(e)}
														className='emoji-picker'
													/>
												</>
											)
										}
									</ImojiIconStyled>

									<SendIconStyled>
										{newMessage === '' ? (
											<div className='like-icon' onClick={handleClickLike}>
												<img src={LikeEmoji} alt=''/>
											</div>
										): (
											<LuSendHorizonal className='send-icon' onClick={handlerSendButton}/>
										)}
									</SendIconStyled>
								</ActionStyled>
							</Col>
						</InputMessageStyled>
					</SendMessageInputStyled>
				</ChatBoxStyled>
			) : (
				<NoneConversationStyled>
					<img src={ChatImage} alt="" />
				</NoneConversationStyled>
			)}
		</>
	);
};

export default ChatBox;
