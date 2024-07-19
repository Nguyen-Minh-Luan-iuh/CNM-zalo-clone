/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useContext, useState } from 'react';
import { Col, Container, Modal, Row, Spinner } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import styled from 'styled-components';
import { toast, Toaster } from "react-hot-toast";

import { CiCamera } from 'react-icons/ci';
import { HiPencilAlt } from 'react-icons/hi';
import { IoIosArrowBack } from 'react-icons/io';

import { AuthToken } from '../../context/AuthToken';
import userApi from '../../api/userApi';

const ModalStyled = styled(Modal)`
	.modal-dialog{
		max-width: 400px;
		margin-left: auto;
		margin-right: auto;
		margin-top: 7rem;
		position: relative;
		width: auto;
		pointer-events: none;

		.modal-content {
			border-radius: 0.3rem;
			.modal-header {
				padding: 0.8rem 1rem;			
				.modal-title {
					font-size: 1rem;
					font-weight: 700;
					width: 100%;
				}
				.btn-close {
					margin-left: 0;
				}
			}
			.modal-body {
				padding: 0.8rem;
				form {
					.form-control{
						font-size: 0.9rem;
						border-radius: 0.2rem;
						&:focus {
							box-shadow: none;
						}
					}
					.form-check{
						font-size: 0.9rem;
					}
				}
			}
		}
	}

	hr {
		margin: 0.8rem 0;
	}
`;
const PreButtonStyled = styled.div`
	cursor: pointer;
	&:hover {
		opacity: 0.8;
	}
`;
const GroupStyled = styled.div`
	display: flex;
	justify-content: center;
	position: relative;
	> svg {
		position: absolute;
		bottom: 0;
		right: calc(50% - 4rem);
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		padding: 0.5rem;
		background-color: var(--color-60);
		cursor: pointer;

		&:hover {
			filter: grayscale(100%);
		}
	}
`;
const AvatarStyled = styled.img`
	width: 8rem;
	height: 8rem;
	border-radius: 50%;
	object-fit: cover;
	display: inline-block;
	border: 2px solid white;
	box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.05);
`;
const LabelStyled = styled.p`
	font-size: 0.9rem;
	color: var(--text-secondary);
	margin-bottom: 0.8rem;
`;
const ValueStyled = styled.p`
	font-size: 0.9rem;
	margin-bottom: 0.8rem;
`;
const UpdateLabelStyled = styled.p`
	font-size: 0.9rem;
	margin-bottom: 0.2rem;
`;
const FormFooterStyled = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	margin-top: 5rem;
	
	.cancel-btn, .update-btn {
		border-radius: 0.2rem;
		padding: 0.6rem 1rem;
		font-weight: 600;
		font-size: 0.94rem;
		border: none;
	}

	.cancel-btn {
		background-color: var(--button-neutral-normal);
		color: var(--button-neutral-text);

		&:hover {
			background-color: var(--button-neutral-hover);
		}
	}

	.update-btn {
		background-color: var(--button-primary-normal);

		&:hover {
			background-color: var(--button-primary-hover);
		}
	}
`;
const ButtonStyled = styled.button`\
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	outline: none;
	border: none;
	padding: 0.3rem;
	background-color: white;
	transition: all linear 0.2s;
	border-radius: 0.2rem;
	&:hover {
		background-color: var(--button-tertiary-neutral-hover);
	}
`;

const ProfileModel = ({ show, handleClose }) => {
	const { user, setUser } = useContext(AuthToken);
	const userForUpdateDefault = {
		userID: user.userID,
		fullName: user.fullName,
		dateOfBirth: user.dateOfBirth,
		gender: user.gender
	}
	const [indexBody, setIndexBody] = useState(0);
	const [imagePreview, setImagePreview] = useState('');
	const [userForUpdate, setUserForUpdate] = useState(userForUpdateDefault);
	const [imageForUpdate, setImageForUpdate] = useState(null)

	const handleImageChange = (e) => {
		const selectedImage = e.target.files[0];
		setImagePreview(URL.createObjectURL(selectedImage));
		setImageForUpdate(selectedImage)
	};

	const handleUpdateUserInfo = async () => {
		try {
			const res = await userApi.updateInfo(userForUpdate);
			setUser(res.updatedUser[0])
			setIndexBody(0)
			toast.success("Cập nhật thông tin thành công");
		} catch (error) {
			console.log(error)
		}
	}

	const handleCancelUpdateUserInfo = () => {
		setIndexBody(0)
		setUserForUpdate(userForUpdateDefault)
	}

	const handleUpdateUserAvatar = async () => {
		try {
			const res = await userApi.updateAvatar(imageForUpdate);
			setUser(res.updatedUser[0])
			setIndexBody(0)
			setImagePreview('');
			setImageForUpdate(null)
			toast.success("Cập nhật avatar thành công");
		} catch (error) {
			if(error?.response && error?.response.status === 500){
				toast.error("Vui lòng chọn ảnh có kích thước không quá 4MB.")
			}
		}
	}

	const handleCancelUpdateUserAvatar = () => {
		setIndexBody(0)
		setImagePreview('');
		setImageForUpdate(null)
	}

	const items = [
		{
			key: 'info',
			title: 'Thông tin tài khoản',
			body: (
				<>
					<Container>
						<Row>
							<GroupStyled>
								<AvatarStyled src={user?.profilePic} alt="" />
								<CiCamera onClick={() => setIndexBody(1)} />
							</GroupStyled>
						</Row>
						<Row>
							<h5 className="text-center mt-3 fw-bold">
								{user?.fullName}
							</h5>
						</Row>
						<hr />
						<Row className="mt-2">
							<Col md={12}>
								<h6 className='fw-bold'>Thông tin cá nhân</h6>
							</Col>
						</Row>
						<Row className="mt-2">
							<Col md={4}>
								<LabelStyled>Giới tính</LabelStyled>
								<LabelStyled>Ngày sinh</LabelStyled>
								<LabelStyled>Điện thoại</LabelStyled>
							</Col>
							<Col md={8}>
								<ValueStyled>{user?.gender === 'male' ? 'Nam' : 'Nữ'}</ValueStyled>
								<ValueStyled>{user?.dateOfBirth}</ValueStyled>
								<ValueStyled>{user?.phoneNumber.replace(/\s+/g, "").replace(/^(\+\d{2})(\d{3})(\d{3})(\d{3})$/, "$1 $2 $3 $4")}</ValueStyled>
							</Col>
						</Row>
						<hr />
						<Row>
							<Col md={12}>
								<ButtonStyled onClick={() => setIndexBody(2)}>
									<span className="d-inline-block fw-bold mx-1">Cập nhật</span> <HiPencilAlt />
								</ButtonStyled>
							</Col>
						</Row>
					</Container>
				</>
			),
		},
		{
			key: 'update-image',
			title: 'Cập nhật ảnh đại diện',
			body: (
				<>
					<div>
						<label htmlFor="photo" className="form-label">
							Room Photo
						</label>
						<input
							type="file"
							id="photo"
							name="photo"
							className="form-control mb-3"
							onChange={handleImageChange}
						/>
						{imagePreview && (
							<div className='d-flex justify-content-center align-items-center'>
								<img
									src={imagePreview}
									alt="Preview Room Photo"
									style={{
										maxWidth: '80%'
									}}
								/>
							</div>
						)}
					</div>
					{imageForUpdate !== null && (
						<FormFooterStyled className='mt-5'>
							<Button className='cancel-btn mx-2' variant="secondary" onClick={handleCancelUpdateUserAvatar}>Hủy</Button>
							<Button 
								className='update-btn' 
								variant="primary" 
								onClick={handleUpdateUserAvatar}
							>
								Cập nhật
							</Button>
						</FormFooterStyled>
					)}
				</>
			),
		},
		{
			key: 'update-info',
			title: 'Cập nhật thông tin cá nhân',
			body: (
				<>
					<Container>
						<Form>
							<Form.Group className="mb-4">
								<Form.Label className='mb-0'>
									<UpdateLabelStyled>Tên hiển thị</UpdateLabelStyled>
								</Form.Label>
								<Form.Control 
									type="text" 
									value={userForUpdate.fullName}
									onChange={(e) => setUserForUpdate({...userForUpdate, fullName: e.target.value})}
								>
								</Form.Control>
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Label className='d-block mb-3'>
									<h6 className='fw-bold'>Thông tin cá nhân</h6>
								</Form.Label>
								<Form.Check
									checked={userForUpdate.gender === 'male'}
									inline
									value='male'
									label="Nam"
									type='radio'
									id='inline-radio-1'
									onChange={(e) => setUserForUpdate({...userForUpdate, gender: e.target.value})}
								/>
								<Form.Check
									checked={userForUpdate.gender === 'female'}
									inline
									value='female'
									label="Nữ"
									type='radio'
									id='inline-radio-2'
									onChange={(e) => setUserForUpdate({...userForUpdate, gender: e.target.value})}
								/>
							</Form.Group>

							<Form.Group>
								<Form.Label className='mb-0'>
									<UpdateLabelStyled>Ngày sinh</UpdateLabelStyled>
								</Form.Label>
								<Form.Control 
									type="date" 
									value={userForUpdate.dateOfBirth.split("/").reverse().join("-")}
									onChange={(e) => setUserForUpdate({...userForUpdate, dateOfBirth: e.target.value.split("-").reverse().join("/")})}
								>
								</Form.Control>
							</Form.Group>
						</Form>
						<FormFooterStyled>
     						<Button className='cancel-btn mx-2' variant="secondary" onClick={handleCancelUpdateUserInfo}>Hủy</Button>
							<Button 
								className='update-btn' 
								variant="primary" 
								onClick={handleUpdateUserInfo}
								disabled={userForUpdate.fullName === '' || (userForUpdate.fullName === user.fullName && userForUpdate.gender === user.gender && userForUpdate.dateOfBirth === user.dateOfBirth)}
							>
								Cập nhật
							</Button>
						</FormFooterStyled>
					</Container>
				</>
			),
		},
	];
	return (
		<ModalStyled show={show} onHide={handleClose}>
			<Toaster toastOptions={{ duration: 4000 }}/>
			<Modal.Header closeButton>
				<Modal.Title>
					<Row className=" justify-content-between">
						{!!indexBody && (
							<Col md={1}>
								<PreButtonStyled
									onClick={() => setIndexBody(0)}
								>
									<IoIosArrowBack />
								</PreButtonStyled>
							</Col>
						)}
						<Col md={indexBody ? 11 : 12}>
							<p className="m-0">{items[indexBody].title}</p>
						</Col>
					</Row>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{!user ? (
					<Container>
						<Row className="justify-content-center py-5">
							<Spinner animation="border" role="status">
								<span className="visually-hidden">
									Loading...
								</span>
							</Spinner>
						</Row>
					</Container>
				) : (
					items[indexBody].body
				)}
			</Modal.Body>
		</ModalStyled>
	);
};

export default ProfileModel;
