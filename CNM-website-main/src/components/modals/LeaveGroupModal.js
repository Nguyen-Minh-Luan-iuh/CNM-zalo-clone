/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useContext, useEffect, useState } from 'react';
import { Col, Container, Modal, Row, Spinner } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import styled from 'styled-components';
import { toast, Toaster } from "react-hot-toast";

import { AuthToken } from '../../context/AuthToken';
import { ConversationToken } from '../../context/ConversationToken';
import conversationApi from '../../api/conversationApi';

const ModalStyled = styled(Modal)`
	&.choose-owner-before-leave-modal{
		.modal-dialog{
			margin-top: 7rem;
			.modal-content {
				.modal-body {
					padding: 0.8rem 0;
					.container{
						padding: 0;
						form{
							min-height: 23rem;
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
	margin-top: 2rem;
	
	.cancel-btn, .leave-btn, .choose-and-continue-btn {
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

	.leave-btn {
        background-color: var(--button-danger-normal);
        color: var(--button-danger-text);

		&:hover {
            background-color: var(--button-danger-hover);
		}
	}

	.choose-and-continue-btn{
		background-color: var(--button-primary-normal);

		&:hover {
			background-color: var(--button-primary-hover);
		}
	}

	&.form-footer-for-choosing-owner{
		margin-top:0;
		padding: 0.8rem 0.8rem 0;
		border-top: 1px solid var(--border);
	}
`;

const ConversationFormCheckStyled = styled.div`
    padding: 0.6rem 1.2rem;
    border-radius: 0.3rem;
    display: flex;
    align-items: center;
    cursor: pointer;

    &.disabled{
        cursor: default;
        .form-check-input{
            opacity: 0.5;
        }
        &:hover {
            background-color: transparent;
        }
        pointer-events: none;
    }

    .conversation-info-item{
        display: flex;
        align-items: center;
        margin-bottom: 0;
        img{
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 50%;
            object-fit: cover;
            margin-right: 0.7rem
        }

        .conversation-name{
            display: flex;
            flex-direction: column;
            justify-content: center;
            font-size: 0.9rem;
            .joined-label{
                font-size: 0.75rem;
                color: var(--text-secondary);
            }
        }
    }
    &:hover {
        background-color: var(--layer-background-hover);
    }
`


const LeaveGroupModal = ({ show, handleClose, isOwner, membersInfo, groupSelected, listGroup, setListGroup }) => {
	const { user } = useContext(AuthToken);
	const { conversationSelected, setConversations, setMessages, conversations, setToggleConversationInfo, setConversationSelected } = useContext(ConversationToken);
	const [ showChooseOwnerBeforeLeavingModal, setShowChooseOwnerBeforeLeavingModal ] = useState(false)
	const [ showLeaveGroupModal, setShowLeaveGroupModal ] = useState(false)
	const [ choseOwner, setChoseOwner ] = useState(membersInfo[0]?.userID)

	useEffect(() => {
		if(show && isOwner){
			setShowChooseOwnerBeforeLeavingModal(true)
		} else if(show && !isOwner) {
			setShowLeaveGroupModal(true)
		} else{
			setShowChooseOwnerBeforeLeavingModal(false)
			setShowLeaveGroupModal(false)
		}
	}, [show])

    const handleConfirmLeaveGroup = async () => {
        try {
			let response
            //Call api xóa thành viên ở đây với conversationId và userID của thành viên muốn xóa
			if(conversationSelected.conversationId){
				if(isOwner){
					response = await conversationApi.leaveGroup(conversationSelected.conversationId, user.userID, choseOwner)
				} else {
					response = await conversationApi.leaveGroup(conversationSelected.conversationId, user.userID, null)
				}
				setMessages(null)
				setConversationSelected(null)
			} else {
				if(isOwner){
					response = await conversationApi.leaveGroup(groupSelected.conversationId, user.userID, choseOwner)
				} else {
					response = await conversationApi.leaveGroup(groupSelected.conversationId, user.userID, null)
				}
				const updatedListGroup = listGroup.filter(group => group.conversationId !== response.conversationId)
				setListGroup(updatedListGroup)
			}
			const updatedConversations = conversations.filter(conversation => conversation.conversationId !== response.conversationId);
            setConversations(updatedConversations)
            setToggleConversationInfo({toggle: false, level: 0})
			setChoseOwner(membersInfo[0]?.userID)
			handleClose()
        } catch (error) {
            console.log(error)
        }
    }

	const handleChooseGroupOwnerAndContinue = () => {
		setShowChooseOwnerBeforeLeavingModal(false)
		setShowLeaveGroupModal(true)
	}

	const handlecCancelChooseOwner = () => {
		setChoseOwner(membersInfo[0]?.userID)
		handleClose()
	}

	return (
		<>
			{showChooseOwnerBeforeLeavingModal && (
				<ModalStyled className='choose-owner-before-leave-modal' show={showChooseOwnerBeforeLeavingModal} onHide={() => handlecCancelChooseOwner()}>
					<Toaster toastOptions={{ duration: 4000 }}/>
					<Modal.Header closeButton>
						<Modal.Title>
							<Row className=" justify-content-between">
								<Col md={12}>
									<p className="m-0">Chọn trưởng nhóm mới trước khi rời</p>
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
										{membersInfo.map(member => {
											return (
												<ConversationFormCheckStyled key={member.userID} onClick={() => setChoseOwner(member.userID)}>
                                                        <Form.Check
                                                            inline
                                                            value={member.userID}
                                                            type='radio'
                                                            id=''
															checked={member.userID === choseOwner}
                                                        />
                                                        <Form.Label className="conversation-info-item">
                                                            <img 
                                                                src={member.profilePic} 
                                                                alt=''
                                                            />
                                                            <div className='conversation-name'>
                                                                <span>
                                                                    {
                                                                        member.fullName
                                                                    }
                                                                </span>
                                                            </div>
                                                        </Form.Label>
                                                    </ConversationFormCheckStyled>
											)
										})}
								</Form>
								<FormFooterStyled className='form-footer-for-choosing-owner'>
									<Button className='cancel-btn mx-2' variant="secondary" onClick={() => handlecCancelChooseOwner()}>Hủy</Button>
									<Button 
										className='choose-and-continue-btn' 
										variant="primary"
										onClick={() => handleChooseGroupOwnerAndContinue()}
									>
										Chọn và tiếp tục
									</Button>
								</FormFooterStyled>
							</Container>
						)}
					</Modal.Body>
				</ModalStyled>
			)} 
			{showLeaveGroupModal && (
				<ModalStyled show={showLeaveGroupModal} onHide={handleClose}>
					<Toaster toastOptions={{ duration: 4000 }}/>
					<Modal.Header closeButton>
						<Modal.Title>
							<Row className=" justify-content-between">
								<Col md={12}>
									<p className="m-0">Rời nhóm và xóa trò chuyện?</p>
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
											Bạn sẽ không thể xem lại tin nhắn trong nhóm này sau khi rời nhóm.
										</NoteLabelStyled>
									</Form.Label>
								</Form>
								<FormFooterStyled>
									<Button className='cancel-btn mx-2' variant="secondary" onClick={handleClose}>Hủy</Button>
									<Button 
										className='leave-btn' 
										variant="primary"
										onClick={() => handleConfirmLeaveGroup()}
									>
										Rời nhóm
									</Button>
								</FormFooterStyled>
							</Container>
						)}
					</Modal.Body>
				</ModalStyled>
			)}
		</>
	);
};

export default LeaveGroupModal;
