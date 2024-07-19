import React from 'react';
import styled from 'styled-components';

import ConversationList from '../components/chat/ConversationList';
import ChatBox from '../components/chat/ChatBox';
import ConversationInfo from '../components/chat/ConversationInfo';
import ConversationProvide from '../context/ConversationToken';

const WrapperStyled = styled.div`
	display: flex;
`;

const Home = () => {
	return (
		<ConversationProvide>
			<WrapperStyled>
				<ConversationList />
				<ChatBox />
				<ConversationInfo />
			</WrapperStyled>
		</ConversationProvide>
	);
};

export default Home;
