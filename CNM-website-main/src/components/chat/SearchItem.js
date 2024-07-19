import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { AuthToken } from '../../context/AuthToken';
import conversationApi from '../../api/conversationApi';
import { ConversationToken } from '../../context/ConversationToken';
import userApi from '../../api/userApi';
import { toast, Toaster } from "react-hot-toast";

const ItemStyled = styled.div`
	padding: 0.3rem 0.2rem 0.3rem 1rem;
	&:hover {
		background: var(--layer-background-hover);
	}
`;

const InfoStyled = styled.div`
	flex: 1;
	display: flex;
	padding: 0.25rem 0;
	cursor: pointer;

	img {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		background-color: white;
		border: 1px solid var(--color-60);
		margin-right: 0.5rem;
	}
	> div {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding-left: 0.2rem;
		> * {
			margin: 0;

		}
		.search-fullname {
			font-weight: 600;
			font-size: 0.875rem;
			color: var(--text-primary);
		}
		.search-phone-number{
			font-size: 0.725rem;
			color: var(--text-secondary);
		}
	}
`;

const AddFriendButtonStyled = styled.div`
	border: 1px solid var(--button-tertiary-primary-text);
	color: var(--button-tertiary-primary-text);
	padding: 0.15rem 1rem !important;
	border-radius: 0.2rem;
	font-size: 0.85rem;
	font-weight: 600;
	cursor: pointer;
	&:hover {
		background-color: var(--button-tertiary-primary-hover);
	}
`;

const SearchItem = ({ userItem, handleHideAddFriendModal, isSentAddFriend, updateSendAddFriendStatus }) => {
	const { user, setUser } = useContext(AuthToken);
	const { setConversationSelected, toggleConversationInfo, setToggleConversationInfo, setNewConversation } = useContext(ConversationToken);

	const handleFriendRequest = async (e) => {
		try {
			e.stopPropagation()
			await userApi.sentRequestAddFriend(user.userID, userItem.userID);
			updateSendAddFriendStatus(userItem.userID, true);
			setUser(prevUser => ({
				...prevUser,
				listRequestAddFriendsSent: [...(prevUser.listRequestAddFriendsSent || []), userItem.userID]
			}));
			toast.success("Đã gửi lời mời kết bạn");
		} catch (error) {
		  	console.log('Error:', error);    
		}
	};

	const handleCancelFriendRequest = async (e) => {
		try {
			e.stopPropagation()
			await userApi.cancelFriend(user.userID, userItem.userID);
			updateSendAddFriendStatus(userItem.userID, false);
			setUser(prevUser => ({
				...prevUser,
				listRequestAddFriendsSent: (prevUser.listRequestAddFriendsSent || []).filter(id => id !== userItem.userID)
			}));
			toast.success("Đã thu hồi lời mời kết bạn");
		} catch (error) {
		  	console.log('Error:', error);    
		}
	};

	const handlerItem = async () => {
		try {
			const res = await conversationApi.createConversation({
				participantIds: [user.userID, userItem.userID],
			});
			if (res?.conversation) {
				setToggleConversationInfo({toggle: toggleConversationInfo?.toggle, level: res?.conversation.participantIds.length > 2 ? 0 : 2})
				setNewConversation(res?.conversation)
				setConversationSelected(res?.conversation);
				handleHideAddFriendModal()
			}
		} catch (error) {}
	};
	return (
		<ItemStyled
			className="d-flex justify-content-between"
			onClick={handlerItem}
		>
			<Toaster toastOptions={{ duration: 1500 }} />
			<InfoStyled>
				<img src={userItem?.profilePic} alt="" />
				<div>
					<p className='search-fullname'>{userItem?.fullName}</p>
					<p className='search-phone-number'>{userItem?.phoneNumber}</p>
				</div>
			</InfoStyled>
			<div className="d-flex align-items-center">
				{!userItem?.friends?.includes(user.userID) && (
					<>
						{isSentAddFriend ? (
							<AddFriendButtonStyled className="py-2" onClick={(e) => handleCancelFriendRequest(e)}>Thu hồi lời mời</AddFriendButtonStyled>
						) : (
							<AddFriendButtonStyled className="py-2" onClick={(e) => handleFriendRequest(e)}>Kết bạn</AddFriendButtonStyled>
						)}
					</>
				)}	
			</div>
		</ItemStyled>
	);
};

export default SearchItem;
