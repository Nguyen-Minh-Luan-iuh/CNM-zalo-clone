/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useContext } from 'react';
import { Col, Container, Modal, Row, Spinner } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import styled from 'styled-components';
import { toast, Toaster } from "react-hot-toast";

import { AuthToken } from '../../context/AuthToken';
import { ConversationToken } from '../../context/ConversationToken';
import conversationApi from '../../api/conversationApi';

const ModalStyled = styled(Modal)`
	.modal-dialog{
		max-width: 400px;
		margin-left: auto;
		margin-right: auto;
		margin-top: 12rem;
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
	margin-top: 3.5rem;
	
	.cancel-btn, .agree-btn {
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

	.agree-btn {
		background-color: var(--button-primary-normal);

		&:hover {
			background-color: var(--button-primary-hover);
		}
	}
`;


const ConfirmModal = ({ memberIdForDelete, show, handleClose, setCurrentMembers }) => {
	const { user } = useContext(AuthToken);
	const { conversationSelected, setConversationSelected, setMessages, setHaveNewMessageConversations } = useContext(ConversationToken);

    const handleConfirmDeleteMember = async () => {
        try {
            //Call api xóa thành viên ở đây với conversationId và userID của thành viên muốn xóa
			const response = await conversationApi.removeMemberFromGroup(conversationSelected.conversationId, memberIdForDelete)
			conversationSelected.membersInfo = conversationSelected.membersInfo.filter(member => {
				return member.userID !== response.resData.RemovedUserId
			})
			conversationSelected.participantIds = conversationSelected.participantIds.filter(participantId => participantId.participantId !==  response.resData.RemovedUserId)
			setConversationSelected((prev) => ({...conversationSelected}))
			setMessages((prevMessages) =>
				prevMessages ? [...prevMessages, response.resData.savedMessage] : [response.resData.savedMessage]
			);
			setHaveNewMessageConversations([{conversationId: conversationSelected.conversationId, message: response.resData.savedMessage}])
			const currentMembersIds = conversationSelected.participantIds.map(updatedParticipantId => updatedParticipantId.participantId)
			setCurrentMembers((prev) => ([...currentMembersIds]))
			handleClose()
        } catch (error) {
            console.log(error)
        }
    }

	return (
		<ModalStyled show={show} onHide={handleClose}>
			<Toaster toastOptions={{ duration: 4000 }}/>
			<Modal.Header closeButton>
				<Modal.Title>
					<Row className=" justify-content-between">
						<Col md={12}>
							<p className="m-0">Xác nhận</p>
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
                                    Xóa thành viên này khỏi nhóm?
                                </NoteLabelStyled>
							</Form.Label>
						</Form>
						<FormFooterStyled>
     						<Button className='cancel-btn mx-2' variant="secondary" onClick={handleClose}>Đóng</Button>
							<Button 
								className='agree-btn' 
								variant="primary"
                                onClick={() => handleConfirmDeleteMember()}
							>
								Đồng ý
							</Button>
						</FormFooterStyled>
					</Container>
				)}
			</Modal.Body>
		</ModalStyled>
	);
};

export default ConfirmModal;
