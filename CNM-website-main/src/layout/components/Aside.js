import React, { useContext, useRef, useState } from 'react';
import styled from 'styled-components';
import { OverlayTrigger, Popover } from 'react-bootstrap';

import Navbar from './Navbar';
import { AuthToken } from '../../context/AuthToken';
import { useNavigate } from 'react-router-dom';
import configs from '../../configs';
import ProfileModal from '../../components/modals/ProfileModal';
import ChangePasswordModal from '../../components/modals/ChangePasswordModal';

const WrapperStyled = styled.aside`
	width: 4rem;
	height: 100vh;
	position: fixed;
	display: flex;
	flex-direction: column;
	justify-content: start;
	align-items: center;
	top: 0;
	background-color: var(--color-30);
`;

const ProfilePicStyled = styled.div`
	width: 3rem;
	height: 3rem;
	border-radius: 50%;
	margin: 1rem 0;
	margin-top: 2rem;
	padding: 0.05rem;
	overflow: hidden;
	background-color: white;
	cursor: pointer;
	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 50%;
		background-color: white;
	}
`;

const PopoverStyled = styled(Popover)`
	user-select: none;
	width: 25rem;
	border-radius: 0.2rem;
	box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
	border: 1px solid var(--border);
	overflow: hidden;
	padding-bottom: 0.4rem;
	.popover-header {
		font-weight: 600;
		font-size: 1.1rem;
		background-color: white;
		padding-top: 0.8rem;
		padding-bottom: 0.8rem;
		border-bottom: none;
	}

	.popover-body{
		padding: 0;
		hr {
			margin: 0.2rem 1rem;
			color: var(--border);
			opacity: 1;
		}
		hr:first-of-type{
			margin-top: 0;
		}
	}

	.popover-arrow::after,
	.popover-arrow::before {
		display: none;
	}
`;
const ProfileButton = styled.button`
	display: block;
	width: 100%;
	background-color: white;
	border: none;
	text-align: left;
	padding: 0.5rem 1rem;

	&:hover {
		background: #f3f5f6;
	}
`;
const LogoutStyled = styled.button`
	display: block;
	width: 100%;
	background-color: white;
	border: none;
	text-align: left;
	padding: 0.5rem 1rem;


	&:hover {
		background: #f3f5f6;
	}
`;

const Aside = () => {
	const profileRef = useRef(null);
	const navigate = useNavigate();
	const { user, logout } = useContext(AuthToken);
	const [showProfile, setShowProfile] = useState(false);
	const [showChangePassword, setShowChangePassword] = useState(false);
	const [showPopover, setShowPopover] = useState(false);

	const handleCloseProfile = () => setShowProfile(false);
	const handleShowProfile = () => setShowProfile(true);

	const handleCloseChangePassword = () => setShowChangePassword(false);
	const handleShowChagePassword = () => setShowChangePassword(true);

	const handleLogoutButton = () => {
		logout();
		navigate(configs.routes.login);
	};

	const handleClickAvatar = (e) => {
		e.stopPropagation();
		setShowPopover(true)
	}

	window.addEventListener("click", (e) => {
		setShowPopover(false)
    });

	return (
		<WrapperStyled ref={profileRef}>
			<OverlayTrigger
				show={showPopover}
				placement="right-start"
				rootClose
				overlay={
					<PopoverStyled>
						<Popover.Header as="h3">{user.fullName}</Popover.Header>
						<Popover.Body>
							<hr/>
							<ProfileButton onClick={handleShowProfile}>
								Hồ sơ của bạn
							</ProfileButton>
							<ProfileButton onClick={handleShowChagePassword}>
								Đổi mật khẩu
							</ProfileButton>
							<hr/>
							<LogoutStyled onClick={handleLogoutButton}>
								Đăng xuất
							</LogoutStyled>
						</Popover.Body>
					</PopoverStyled>
				}
			>
				<ProfilePicStyled onClick={(e) => handleClickAvatar(e)}>
					<img src={user.profilePic} alt="Ảnh đại diện" />
				</ProfilePicStyled>
			</OverlayTrigger>
			<Navbar />
			<ProfileModal show={showProfile} handleClose={handleCloseProfile} />
			<ChangePasswordModal show={showChangePassword} handleClose={handleCloseChangePassword} />
		</WrapperStyled>
	);
};

export default Aside;
