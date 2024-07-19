/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useContext, useEffect, useState } from 'react';
import { Col, Container, Modal, Row, Spinner } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import styled from 'styled-components';
import { toast, Toaster } from "react-hot-toast";
import { CiSearch } from "react-icons/ci";

import { AuthToken } from '../../context/AuthToken';
import messageApi from '../../api/messageApi';
import { ConversationToken } from '../../context/ConversationToken'


const ModalStyled = styled(Modal)`
	.modal-dialog{
		max-width: 520px;
		margin-left: auto;
		margin-right: auto;
		margin-top: 0.6rem;
		margin-bottom: 0rem;
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
				padding: 1rem 0.6rem;
				form {
					border-bottom: 1px solid var(--border);
                    .search-conversation-item{
                        display: flex;
                        align-items: center;
                        border: 1px solid var(--border);
                        padding-left: 0.6rem;
                        border-radius: 1.2rem;
                        overflow: hidden;
                        &:has(input:focus) {
							border-color: var(--border-focused);
						}
                        .search-conversation-icon{
                            font-size: 1.05rem;
                            margin-right: 0.3rem;
                            color: var(--icon-secondary);
                        }
                        .form-control{
                            font-size: 0.9rem;
                            padding: 0.5rem 0;
                            &:focus {
                                box-shadow: none;
                            }
                            border: none;
                        }
                    }
					.form-check{
						font-size: 0.9rem;
					}
                    h6{
                        font-size: 0.92rem;
                    }
					.conversation-info-list{
						height: 31rem; 
						overflow-y: scroll;
					}
				}
			}
		}
	}

	hr {
		margin: 0.8rem 0;
	}
`;
const FormFooterStyled = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	margin-top: 2rem;
	
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
const ConversationFormCheckStyled = styled.div`
    padding: 0.44rem 0.5rem;
    border-radius: 0.3rem;
    display: flex;
    align-items: center;
    cursor: pointer;
    .conversation-info-item{
        margin-bottom: 0;
        img{
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 50%;
            object-fit: cover;
            margin-right: 0.7rem
        }
        span{
            font-size: 0.9rem;
        }
    }
    &:hover {
        background-color: var(--layer-background-hover);
    }
`


const ShareMessageModal = ({ show, handleClose, recentlyConversations, friendsWithConversationId, message }) => {
	const { user } = useContext(AuthToken);
    const [conversationNameInput, setConversationNameInput] = useState('')
	const [checkedConversations, setCheckedConversations] = useState([])
	const { setHaveNewMessageConversations } = useContext(ConversationToken);
	const [searchingConversations, setSearchingConversations] = useState([])

	useEffect(() => {
		const recentlyMatchingConversations = recentlyConversations.filter(conversation => {
			if(conversation.name){
				return conversation.name.includes(conversationNameInput.trim())
			} else {
				return conversation?.membersInfo?.find(
					(member) => member.userID !== user?.userID
				)?.fullName.includes(conversationNameInput.trim())
			}
		});
		const recentlyConversationIDs = recentlyMatchingConversations.map(conversation => conversation.conversationId);

		const friendsMatchingConversations = friendsWithConversationId.filter(conversation =>
			conversation.fullName.includes(conversationNameInput.trim()) && !recentlyConversationIDs.includes(conversation.conversationId)
		);

		const combinedConversationIDs = [...recentlyMatchingConversations, ...friendsMatchingConversations];
	
		setSearchingConversations(combinedConversationIDs);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [conversationNameInput])

    const handleCancelShareMessage = () => {
        setConversationNameInput('')
		setCheckedConversations([])
        handleClose()
    }

	const handleShareMessage = async () => {
		if(checkedConversations.length !== 0 && message.content){
			try {
				const res = await messageApi.shareMessage({checkedConversations, messageContent: message.content, messageType: message.type});
				let haveNewMessageConversations = []
				res.data.forEach(item => {
					haveNewMessageConversations.push({conversationId: item.conversation.conversationId, message: item.savedMessage})
				})
				setHaveNewMessageConversations(haveNewMessageConversations)
				handleCancelShareMessage()
			} catch (error) {
				console.log(error)
			}
		}
	}

	const handleConversationClick = (conversationId) => {
        setCheckedConversations(prevCheckedConversations => {
            if (prevCheckedConversations.includes(conversationId)) {
                return prevCheckedConversations.filter(id => id !== conversationId);
            } else {
                return [...prevCheckedConversations, conversationId];
            }
        });
    };

	return (
		<ModalStyled show={show} onHide={handleCancelShareMessage}>
			<Toaster toastOptions={{ duration: 4000 }}/>
			<Modal.Header closeButton>
				<Modal.Title>
					<Row className=" justify-content-between">
						<Col md={12}>
							<p className="m-0">Chia sẻ</p>
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
							<Form.Group className="search-conversation-item mb-3">
                                <CiSearch className='search-conversation-icon'/>
								<Form.Control 
									type="text" 
                                    placeholder='Tìm kiếm hội thoại cần chia sẻ'
                                    value={conversationNameInput}
                                    onChange={(e) => setConversationNameInput(e.target.value)}
								>
								</Form.Control>
							</Form.Group>
                            <hr />
							<Form.Group className="conversation-info-list">
								{conversationNameInput.trim() === "" ? (
									<>
										<Form.Label className='d-block mb-2'>
											<h6 className='fw-bold'>Trò chuyện gần đây</h6>
										</Form.Label>
										{recentlyConversations.map(conversation => {
											return (
												<ConversationFormCheckStyled key={conversation.conversationId} onClick={() => handleConversationClick(conversation.conversationId)}>
													<Form.Check
														inline
														value={conversation.conversationId}
														type='checkbox'
														id={`checkbox-${conversation.conversationId}`}
														checked={checkedConversations.includes(conversation.conversationId)}
													/>
													<Form.Label className="conversation-info-item">
														<img 
															src={
																conversation?.avatar ||
																conversation?.membersInfo?.find(
																(member) => member.userID !== user?.userID
															)?.profilePic} 
															alt=''
														/>
														<span>
															{
																conversation?.name ||
																conversation?.membersInfo?.find(
																	(member) => member.userID !== user?.userID
																)?.fullName
															}
														</span>
													</Form.Label>
												</ConversationFormCheckStyled>
											)
										})}
										<Form.Label className='d-block my-2'>
											<h6 className='fw-bold'>Bạn bè</h6>
										</Form.Label>
										{friendsWithConversationId.map(friend => {
											return (
												<ConversationFormCheckStyled key={friend.conversationId} onClick={() => handleConversationClick(friend.conversationId)}>
													<Form.Check
														inline
														value={friend.conversationId}
														type='checkbox'
														id={`checkbox-${friend.conversationId}`}
														checked={checkedConversations.includes(friend.conversationId)}
													/>
													<Form.Label className="conversation-info-item">
														<img 
															src={friend.profilePic} 
															alt=''
														/>
														<span>
															{
																friend.fullName
															}
														</span>
													</Form.Label>
												</ConversationFormCheckStyled>
											)
										})}
									</>
								) : (
									<>									
										{searchingConversations.map(conversation => {
											return (
												<ConversationFormCheckStyled key={conversation?.conversationId} onClick={() => handleConversationClick(conversation.conversationId)}>
													<Form.Check
														inline
														value={conversation?.conversationId}
														type='checkbox'
														id={`checkbox-${conversation?.conversationId}`}
														checked={checkedConversations.includes(conversation?.conversationId)}
													/>
													<Form.Label className="conversation-info-item">
														<img 
															src={conversation?.profilePic ? conversation?.profilePic : conversation?.membersInfo?.find(
																(member) => member.userID !== user?.userID
															)?.profilePic} 
															alt=''
														/>
														<span>
															{
																conversation?.fullName ? conversation?.fullName : (conversation?.name ||
																conversation?.membersInfo?.find(
																	(member) => member.userID !== user?.userID
																)?.fullName)
															}
														</span>
													</Form.Label>
												</ConversationFormCheckStyled>
											)
										})}
									</>
								)}
							</Form.Group>
						</Form>
						<FormFooterStyled>
     						<Button className='cancel-btn mx-2' variant="secondary" onClick={handleCancelShareMessage}>Hủy</Button>
							<Button 
								className='update-btn' 
								variant="primary"
								disabled={checkedConversations.length === 0}
								onClick={() => handleShareMessage()}
							>
								Chia sẻ
							</Button>
						</FormFooterStyled>
					</Container>
				)}
			</Modal.Body>
		</ModalStyled>
	);
};

export default ShareMessageModal;
