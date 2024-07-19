import React, { useContext, createContext } from 'react';
import styled from 'styled-components';
import { AuthToken } from '../../context/AuthToken';
import { ConversationToken } from '../../context/ConversationToken';
import { useSocketContext } from '../../context/SocketContext';
import { SiTinyletter } from "react-icons/si";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { GrGroup } from "react-icons/gr";
import { CgUserList } from "react-icons/cg";
import { GrSend } from "react-icons/gr";

const WrapperStyled = styled.div`
	padding: 1rem 1.2rem;
	width: 100%;
	display: flex;
	align-items: center;
	justify-items: center;
	&:hover {
		cursor: pointer;
		background-color: var(--layer-background-hover);
	}
	&.active {
		background: var(--layer-background-selected);
	}
`;

const InfoStyled = styled.div`
	padding: 0 0.5rem;
	width: 70%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: start;

	h6 {
		width: 100%;
		margin: 0;
		font-size: 0.9rem;
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: var(--text-primary);
	}
	p {
		margin: 0;
		font-size: 0.75rem;
		color: gray;

		img {
			width: 1.2rem;
			height: 1.2rem;
		}
	}
`;
const IconContainer = styled.div`
	margin-right: 0.5rem; /* Add margin to the right of the icon */
`;

const AnnouncementStyled = styled.div`
	background-color: var(--red-dot);
	border-radius: 50%;
	height: 1rem;
	width: 1rem;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-left: 1.6rem;

	span {
		font-size: 0.8rem;
		text-align: center;
		font-weight: 600;
		color: white;
	}
`;

const ThemeContext = createContext();


const Contaction = ({ contaction }) => {

	const { user } = useContext(AuthToken);
	// console.log(user);

	const { conversationSelected, setConversationSelected } =
		useContext(ConversationToken);

	const handlerConversation = () => {
		setConversationSelected(contaction);
	};
	
	let IconComponent;
	switch (contaction.icon) {
		case 'CgUserList':
			IconComponent = CgUserList;
			break;
		case 'GrGroup':
			IconComponent = GrGroup;
			break;
		case 'SiTinyletter':
			IconComponent = SiTinyletter;
			break;
		case 'GrSend':
			IconComponent = GrSend;
			break;
		default:
			IconComponent = LiaUserFriendsSolid;
	}

	return (
		<WrapperStyled
				onClick={handlerConversation}
				className={
					contaction.id === conversationSelected?.id
						? 'active'
						: ''
				}
			>
			<IconContainer>
				<IconComponent  size={26}/>
			</IconContainer>
			<InfoStyled>
				<h6>{contaction?.name}</h6>
			</InfoStyled>
			{contaction.icon === 'SiTinyletter' && user?.listRequestAddFriendsReceived?.length > 0 && (
				<AnnouncementStyled>
					<span>{user?.listRequestAddFriendsReceived?.length}</span>
				</AnnouncementStyled>
			)}
		</WrapperStyled>			
	);
};


export default Contaction;
