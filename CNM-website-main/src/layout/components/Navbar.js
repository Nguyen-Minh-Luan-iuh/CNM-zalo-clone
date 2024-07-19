import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import styled from 'styled-components';

import {
	IoChatbubbleEllipsesOutline,
	IoChatbubbleEllipsesSharp,
} from 'react-icons/io5';
import { RiContactsBookLine, RiContactsBookFill } from 'react-icons/ri';

import configs from '../../configs';
import { AuthToken } from '../../context/AuthToken';

const NavbarStyled = styled(Nav)`
	margin-top: 0.2rem;
	width: 100%;
	display: flex;
	flex-direction: column;
`;

const NavItemStyled = styled(Nav.Link)`
	position: relative;
	width: 100%;
	padding: 1.2rem 0;
	display: flex;
	justify-content: center;
	align-items: center;
	color: white;
	font-size: 1.7rem;
	transition: background-color 0.3s ease;

	&:hover {
		background: var(--layer-background-leftmenu-hover);
	}

	&.active {
		background: var(--layer-background-leftmenu-selected);
	}
`;

const AnnouncementStyled = styled.div`
	background-color: var(--red-dot);
	border-radius: 50%;
	height: 0.9rem;
	width: 0.9rem;
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;

	span {
		font-size: 0.75rem;
		text-align: center;
		font-weight: 600;
		color: white;
	}
`;

const navItems = [
	{
		defaultIcon: IoChatbubbleEllipsesOutline,
		activeIcon: IoChatbubbleEllipsesSharp,
		to: configs.routes.home,
		tooltip: 'Tin nhắn',
	},
	{
		defaultIcon: RiContactsBookLine,
		activeIcon: RiContactsBookFill,
		to: configs.routes.contacts,
		tooltip: 'Danh bạ',
	},
];

const NavIcon = ({ isActive, Icon }) => {
	return isActive ? <Icon /> : <Icon />;
};

const Navbar = () => {
	const { user } = useContext(AuthToken);
	const location = useLocation();
	return (
		<NavbarStyled>
			{navItems.map((navItem, index) => (
				<OverlayTrigger
					key={index}
					placement="right"
					overlay={<Tooltip>{navItem.tooltip}</Tooltip>}
				>
					<NavItemStyled
						as={Link}
						to={navItem.to}
						className={
							location.pathname === navItem.to ? 'active' : ''
						}
					>
						<NavIcon
							Icon={
								location.pathname === navItem.to
									? navItem.activeIcon
									: navItem.defaultIcon
							}
							isActive={location.pathname === navItem.to}
						/>
						{navItem.tooltip === 'Danh bạ' && user?.listRequestAddFriendsReceived?.length > 0 && (
							<AnnouncementStyled>
								<span>{user?.listRequestAddFriendsReceived?.length}</span>
							</AnnouncementStyled>
						)}
					</NavItemStyled>
				</OverlayTrigger>
			))}
		</NavbarStyled>
	);
};

export default Navbar;
