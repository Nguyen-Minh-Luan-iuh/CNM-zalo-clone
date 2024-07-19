import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import {
	AiOutlineUserAdd,
	AiOutlineUsergroupAdd,
} from 'react-icons/ai';
import { CiSearch } from "react-icons/ci";
import AddFriendModal from './modals/AddFriendModal';
import AddGroupModal from './modals/AddGroupModal';
import conversationApi from '../api/conversationApi';
import userApi from '../api/userApi';

const WrapperStyled = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	border-bottom: 1px solid var(--border);
	padding: 1rem 1rem 1.4rem 1rem;

	> *:not(:first-child) {
		padding: 0.35rem;
		border-radius: 0.25rem;
		margin-left: 0.25rem;

		width: 2rem;
		height: 2rem;
		&:hover {
			background-color: var(--button-tertiary-neutral-hover);
			cursor: pointer;
		}
	}
`;

const SearchStyled = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	flex-grow: 1;

	input {
		position: relative;
		width: 100%;
		background-color: var(--field-bg-filled);
		padding: 0.3rem;
		padding-left: 2rem;
		border-radius: 0.3rem;
		border: 1px solid var(--field-bg-filled);
		outline: none;
		font-size: 0.875rem;

		&::placeholder {
			color: #778aa4;
		}

		&:focus{
			background-color: #fff;
			outline: none;
			border-color: var(--border-focused);
		}
	}

	& > :first-child {
		position: absolute;
		color: var(--icon-primary);
		top: 50%;
		transform: translateY(-50%);
		width: 2rem;
		height: 2rem;
		padding: 0.46rem;
		z-index: 1;
		cursor: pointer;
	}
`;

const SearchBox = () => {
	const [showAddFriendModal, setShowAddFriendModal] = useState(false);
	const [showAddGroupModal, setShowAddGroupModal] = useState(false);
	const [recentlyConversations, setRecentlyConversations] = useState([])
    const [friendsWithConversationId, setFriendsWithConversationId] = useState([])

    useEffect(() => {
        if(showAddGroupModal){
            getRecentlyConversations(5)
            getAllFriendsWithConversationId()
        }
    }, [showAddGroupModal])

    const getRecentlyConversations = async (quantity) => {
        try {
            const res = await conversationApi.getRecentlyFriendConversations(quantity);
			console.log(res.conversations)
            setRecentlyConversations(res.conversations)
        } catch (error) {
            console.log(error)
        }
    }

    const getAllFriendsWithConversationId = async () => {
        try {
            const res = await userApi.getAllFriendsWithConversationId();
			console.log(res.friends)
            setFriendsWithConversationId(res.friends)
        } catch (error) {
            console.log(error)
        }
    }

	const handleShowAddFriendModal = () => {
		setShowAddFriendModal(true);
	};
	const handleCloseAddFriendModal = () => {
		setShowAddFriendModal(false);
	};
	const handleShowAddGroupModal = () => {
		setShowAddGroupModal(true);
	};
	const handleCloseCreateGroupModal = () => {
		setShowAddGroupModal(false);
	};
	return (
		<WrapperStyled>
			<SearchStyled>
				<CiSearch />
				<input type="text" placeholder="Tìm kiếm" />
			</SearchStyled>
			<AiOutlineUserAdd onClick={handleShowAddFriendModal} />
			<AiOutlineUsergroupAdd onClick={handleShowAddGroupModal} />

			{/* modal */}
			<AddFriendModal
				show={showAddFriendModal}
				handleClose={handleCloseAddFriendModal}
			/>
			<AddGroupModal
				show={showAddGroupModal}
				handleClose={handleCloseCreateGroupModal}
				recentlyConversations={recentlyConversations}
				friends={friendsWithConversationId}
			/>
		</WrapperStyled>
	);
};

export default SearchBox;
