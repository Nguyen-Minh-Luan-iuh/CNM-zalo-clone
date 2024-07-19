import React from 'react';
import styled from 'styled-components';

import ConversationList from '../components/chat/ConversationList';
import ContactionList from '../components/chat/ContactionList';
import ChatBox from '../components/chat/ChatBox';
import ConversationProvide from '../context/ConversationToken';

const WrapperStyled = styled.div`
	display: flex;
`;

const Contacts = () => {
	return (
		<ConversationProvide>
			<WrapperStyled>
				<ContactionList />
				
			</WrapperStyled>
		</ConversationProvide>
	);
};

export default Contacts;
