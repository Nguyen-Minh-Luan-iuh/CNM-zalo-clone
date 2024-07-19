/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useContext, useState } from 'react';
import { Col, Container, Modal, Row, Spinner } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import styled from 'styled-components';
import { toast, Toaster } from "react-hot-toast";

import { AuthToken } from '../../context/AuthToken';
import { ConversationToken } from '../../context/ConversationToken';
import conversationApi from '../../api/conversationApi';

const ModalStyled = styled(Modal)`
	& + .modal-backdrop{
		z-index: 1059;
	}
	&.confirm-change-group-owner-modal{
		z-index: 1060;
		.modal-dialog{
			max-width: 370px;
		}
	}
	&.choose-owner-modal{
		.modal-dialog{
			margin-top: 10rem;

			.modal-content{
				min-height: 360px;
				.modal-body{
					padding: 0.8rem 0;
					.container{
						padding: 0;
						.form-label{
							width: 100%;
						}
					}
				}
			}
		}
	}

	.modal-dialog{
		max-width: 400px;
		margin-left: auto;
		margin-right: auto;
		margin-top: 15rem;
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

const NoteLabelStyled = styled.p`
    font-size: 0.9rem;
    margin-bottom: 0;
`;
const FormFooterStyled = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	margin-top: 1rem;
	
	.cancel-btn, .continue-btn, .confirm-btn {
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

	.continue-btn {
		background-color: var(--button-secondary-danger-normal);
		color: var(--button-secondary-danger-text);

		&:hover {
			background-color: var(--button-secondary-danger-hover);
		}
	}

	.confirm-btn {
		background-color: var(--button-primary-normal);

		&:hover {
			background-color: var(--button-primary-hover);
		}
	}

	&.form-footer-of-confirm-change-modal{
		margin-top: 0.6rem;
	}
`;

const ChooseOwnerLabelStyled = styled.p`
	font-size: 0.8rem;
	margin-bottom: 0.4rem;
	color: var(--text-secondary);
	padding: 0 1.4rem;
`;

const MemberForChoosingStyled = styled.div`
	display: flex;
	align-items: center;
	padding: 0.7rem 1.4rem;
	cursor: pointer;
	width: 100%;
	img {
		width: 2.4rem;
		height: 2.4rem;
		border-radius: 50%;
		object-fit: cover;
		margin-right: 0.9rem;
	}
	span{
		font-size: 0.875rem;
	}
	&:hover{
		background: var(--layer-background-hover);
	}
`


const ChangeGroupOwnerModal = ({ show, handleClose, membersInfo }) => {
	const { conversationSelected, setConversationSelected, setMessages, setHaveNewMessageConversations } = useContext(ConversationToken);
	const [ showChooseOwnerModal, setShowChooseOwnerModal ] = useState(false)
	const [ showConfirmChangeModal, setShowConfirmChangeModal ] = useState(false)
	const [ choseOwner, setChoseOwner ] = useState({})

    const handleConfirmChangeGroupOwner = async () => {
        try {
            //Call api xóa thành viên ở đây với conversationId và userID của thành viên muốn xóa
			const reponse = await conversationApi.chanceRoleOwner(conversationSelected.conversationId, choseOwner.userID)
			conversationSelected.participantIds = reponse.resData.participantIds
			conversationSelected.membersInfo = reponse.resData.membersInfo
			setConversationSelected((prev) => ({...conversationSelected}))
			setMessages((prevMessages) =>
				prevMessages ? [...prevMessages, reponse.resData.savedMessage] : [reponse.resData.savedMessage]
			);
			setHaveNewMessageConversations([{conversationId: conversationSelected.conversationId, message: reponse.resData.savedMessage}])
			setShowConfirmChangeModal(false)
			setShowChooseOwnerModal(false)
        } catch (error) {
            console.log(error)
        }
    }

	const handleContinue = () => {
		handleClose()
		setShowChooseOwnerModal(true)
	}

	const handleChooseMember = (member) => {
		setChoseOwner(member)
		setShowConfirmChangeModal(true)
	}

	return (
		<>
			{showChooseOwnerModal ? (
				<>
					<ModalStyled className='choose-owner-modal' show={showChooseOwnerModal} onHide={() => setShowChooseOwnerModal(false)}>
						<Toaster toastOptions={{ duration: 4000 }}/>
						<Modal.Header closeButton>
							<Modal.Title>
								<Row className=" justify-content-between">
									<Col md={12}>
										<p className="m-0">Chọn trưởng nhóm mới</p>
									</Col>
								</Row>
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Container>
								<Form>
									<Form.Label className='mb-2'>
										<ChooseOwnerLabelStyled>
											Thành viên
										</ChooseOwnerLabelStyled>
										{membersInfo.map(member => {
											return (
												<MemberForChoosingStyled onClick={() => handleChooseMember(member)}>
													<img src={member.profilePic} alt=''/>
													<span>{member.fullName}</span>
												</MemberForChoosingStyled>
											)
										})}
									</Form.Label>
								</Form>
							</Container>
						</Modal.Body>
					</ModalStyled>
					{showConfirmChangeModal && (
						<ModalStyled className='confirm-change-group-owner-modal' show={showConfirmChangeModal} onHide={() => setShowConfirmChangeModal(false)}>
							<Toaster toastOptions={{ duration: 4000 }}/>
							<Modal.Header closeButton>
								<Modal.Title>
									<Row className=" justify-content-between">
										<Col md={12}>
											<p className="m-0">Xác nhận chọn trưởng nhóm mới</p>
										</Col>
									</Row>
								</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								<Container>
									<Form>
										<Form.Label className='mb-2'>
											<NoteLabelStyled>
												Sau khi thay đổi {choseOwner.fullName} sẽ trở thành trưởng nhóm mới và bạn sẽ trở thành một thành viên bình thường.
											</NoteLabelStyled>
										</Form.Label>
									</Form>
									<FormFooterStyled className='form-footer-of-confirm-change-modal'>
										<Button className='cancel-btn mx-2' variant="secondary" onClick={() => setShowConfirmChangeModal(false)}>Không</Button>
										<Button 
											className='confirm-btn' 
											onClick={() => handleConfirmChangeGroupOwner()}
										>
											Xác nhận
										</Button>
									</FormFooterStyled>
								</Container>
							</Modal.Body>
						</ModalStyled>
					)}
				</>
			) : show && (
				<ModalStyled show={show} onHide={handleClose}>
					<Toaster toastOptions={{ duration: 4000 }}/>
					<Modal.Header closeButton>
						<Modal.Title>
							<Row className=" justify-content-between">
								<Col md={12}>
									<p className="m-0">Chuyển quyền trưởng nhóm</p>
								</Col>
							</Row>
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Container>
							<Form>
								<Form.Label className='mb-2'>
									<NoteLabelStyled>
										Người được chọn sẽ trở thành trưởng nhóm và có mọi quyền quản lý nhóm. Bạn sẽ mất quyền quản lý nhưng vẫn là một thành viên của nhóm. Hành động này không thể phục hồi.
									</NoteLabelStyled>
								</Form.Label>
							</Form>
							<FormFooterStyled>
								<Button className='cancel-btn mx-2' variant="secondary" onClick={handleClose}>Hủy</Button>
								<Button 
									className='continue-btn' 
									onClick={() => handleContinue()}
								>
									Tiếp tục
								</Button>
							</FormFooterStyled>
						</Container>
					</Modal.Body>
				</ModalStyled>
			)}
		</>
	);
};

export default ChangeGroupOwnerModal;
