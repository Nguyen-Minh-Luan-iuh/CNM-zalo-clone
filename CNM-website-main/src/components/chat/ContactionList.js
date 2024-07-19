import React, { useContext, useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import SearchBox from '../SearchBox';
import { AuthToken } from '../../context/AuthToken';
import { useSocketContext } from '../../context/SocketContext';
import Contaction from './Contaction';
import { ConversationToken } from '../../context/ConversationToken';
import userApi from '../../api/userApi';
import ListFriend from './ListFriend';

const AsideStyled = styled.aside`
    min-width: 21.5rem;
    max-width: 21.5rem;
	height: 100vh;
	position: sticky;
	top: 0;
    border-right: 1px solid var(--border);

	background-color: rgba(0, 0, 0, 0.01);
`;

const AsideStyledContent = styled.aside` 
    width: calc(100% - 21.5rem);  
`;
const WrapperStyled = styled.div`
    width: 100%;
	display: flex;
`;

const ListStyled = styled.div`
    width: 100%;
`;

const ContactionList = () => {
    
	const { user } = useContext(AuthToken);
	const { setConversationSelected } = useContext(ConversationToken);

    const defaultContacts = useMemo(() => [
        { id: 1, name: 'Danh sách bạn bè', icon: 'CgUserList' },
        { id: 2, name: 'Danh sách nhóm', icon: 'GrGroup' },
        { id: 3, name: 'Lời mời kết bạn', icon: 'SiTinyletter' },
        { id: 4, name: 'Danh sách đã gửi', icon: 'GrSend' },
    ], []);

    useEffect(() => {
        if (defaultContacts.length > 0) {
            setConversationSelected(defaultContacts[0]);
        }
    }, [defaultContacts, setConversationSelected]);
    
    const displayedContacts = defaultContacts.slice(0, 4);
    return (
        <WrapperStyled>
            <AsideStyled>
                <SearchBox />
                <ListStyled> 
                    {displayedContacts.map((contaction, index) => (
                        <Contaction key={index} contaction={contaction} />
                    ))}
                </ListStyled>
            </AsideStyled>
            <AsideStyledContent>
                <ListFriend />
            </AsideStyledContent>

        </WrapperStyled>
    );
};
export default ContactionList;