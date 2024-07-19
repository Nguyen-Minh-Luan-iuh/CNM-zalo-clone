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


const DeleteGroupModal = ({ show, handleClose }) => {
	const { user } = useContext(AuthToken);
	const { conversationSelected, setConversations, setMessages, conversations, setToggleConversationInfo, setConversationSelected } = useContext(ConversationToken);

    const handleDeleteGroupConversation = async () => {
        try {
			console.log(conversationSelected.conversationId)
            const res = await conversationApi.deleteConversation(conversationSelected.conversationId)
            const updatedConversations = conversations.filter(conversation => conversation.conversationId !== res.conversation);
            setMessages(null)
			setConversationSelected(null)
            setConversations(updatedConversations)
            setToggleConversationInfo({toggle: false, level: 0})
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
							<p className="m-0">Giải tán nhóm</p>
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
                                    Mời tất cả mọi người rời nhóm và xóa tin nhắn? Nhóm đã giải tán sẽ KHÔNG THỂ khôi phục.
                                </NoteLabelStyled>
							</Form.Label>
						</Form>
						<FormFooterStyled>
     						<Button className='cancel-btn mx-2' variant="secondary" onClick={handleClose}>Không</Button>
							<Button 
								className='agree-btn' 
								variant="primary"
                                onClick={() => handleDeleteGroupConversation()}
							>
								Giải tán nhóm
							</Button>
						</FormFooterStyled>
					</Container>
				)}
			</Modal.Body>
		</ModalStyled>
	);
};

export default DeleteGroupModal;
