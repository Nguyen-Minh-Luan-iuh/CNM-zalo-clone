/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Container, Modal, Row, Spinner } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import styled from 'styled-components';
import { toast, Toaster } from "react-hot-toast";

import configs from '../../configs';
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

const UpdateLabelStyled = styled.p`
	font-size: 0.9rem;
	margin-bottom: 0.2rem;
`;
const NoteLabelStyled = styled.p`
    font-size: 0.8rem;
    margin-bottom: 0;
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
const ErrorMessage = styled.span`
	font-size: 0.85rem;
	color: red;
	margin: 0.5rem 0;
`;


const ChangePasswordModal = ({ show, handleClose }) => {
	const { user, logout } = useContext(AuthToken);
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [reenteredNewPassword, setReenteredNewPassword] = useState('')
	const [newPasswordError, setNewPasswordError] = useState('')
	const [currentPasswordError, setCurrentPasswordError] = useState('')
	const navigate = useNavigate();

    const handleCancelChangePassword = () => {
        setCurrentPassword('')
        setNewPassword('')
        setReenteredNewPassword('')
        handleClose()
    }

    const handleChangePassword = async () => {
		setCurrentPasswordError('')
		setNewPasswordError('')
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if(newPassword.length < 6){
			setNewPasswordError("Mật khẩu quá ngắn. Mật khẩu hợp lệ phải gồm 6-32 ký tự")
        } else if(newPassword.length > 32){
			setNewPasswordError("Mật khẩu quá dài. Mật khẩu hợp lệ phải gồm 6-32 ký tự")
        } else if(!passwordRegex.test(newPassword)){
			setNewPasswordError("Mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt")
        } else {
            try {
                await userApi.updatePassword(currentPassword, newPassword)
                setCurrentPassword('')
                setNewPassword('')
                setReenteredNewPassword('')
                toast.success("Cập nhật mật khẩu thành công. Vui lòng đăng nhập lại!")
				setTimeout(() => {
					logout();
					navigate(configs.routes.login);
				}, 2000);
            } catch (error) {
                if(error?.response && error?.response.status === 400){
					setCurrentPasswordError("Mật khẩu hiện tại không chính xác!")
                }
            }
        }
    }

	return (
		<ModalStyled show={show} onHide={handleCancelChangePassword}>
			<Toaster toastOptions={{ duration: 2000 }}/>
			<Modal.Header closeButton>
				<Modal.Title>
					<Row className=" justify-content-between">
						<Col md={12}>
							<p className="m-0">Tạo mật khẩu mới</p>
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
					<Container>
						<Form>
                            <Form.Label className='mb-2'>
								<NoteLabelStyled>
                                    <span className='fw-bold'>Lưu ý: </span>
                                    Mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt, tối thiểu 6 ký tự trở lên & tối đa 32 ký tự.
                                </NoteLabelStyled>
							</Form.Label>
							<Form.Group className="mb-3">
								<Form.Label className='mb-0'>
									<UpdateLabelStyled>Mật khẩu hiện tại</UpdateLabelStyled>
								</Form.Label>
								<Form.Control 
									type="password" 
                                    placeholder='Nhập mật khẩu hiện tại'
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
								>
								</Form.Control>
								{currentPasswordError && <ErrorMessage>{currentPasswordError}</ErrorMessage>}
							</Form.Group>
                            <hr />
							<Form.Group className="mb-3">
								<Form.Label className='mb-0'>
									<UpdateLabelStyled>Mật khẩu mới</UpdateLabelStyled>
								</Form.Label>
								<Form.Control 
									type="password" 
                                    placeholder='Nhập mật khẩu mới'
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
								>
								</Form.Control>
								{newPasswordError && <ErrorMessage>{newPasswordError}</ErrorMessage>}
							</Form.Group>

                            <Form.Group className="mb-4">
								<Form.Label className='mb-0'>
									<UpdateLabelStyled>Nhập lại mật khẩu mới</UpdateLabelStyled>
								</Form.Label>
								<Form.Control 
									type="password" 
                                    placeholder='Nhập lại mật khẩu mới'
                                    value={reenteredNewPassword}
                                    onChange={(e) => setReenteredNewPassword(e.target.value)}
								>
								</Form.Control>
							</Form.Group>
						</Form>
						<FormFooterStyled>
     						<Button className='cancel-btn mx-2' variant="secondary" onClick={handleCancelChangePassword}>Hủy</Button>
							<Button 
								className='update-btn' 
								variant="primary"
                                disabled={currentPassword === '' || newPassword === '' || reenteredNewPassword === '' || newPassword !== reenteredNewPassword} 
                                onClick={handleChangePassword}
							>
								Cập nhật
							</Button>
						</FormFooterStyled>
					</Container>
				)}
			</Modal.Body>
		</ModalStyled>
	);
};

export default ChangePasswordModal;
