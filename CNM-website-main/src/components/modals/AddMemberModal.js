/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useContext, useEffect, useState } from 'react';
import { Col, Container, Modal, Row, Spinner } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import styled from 'styled-components';
import { toast, Toaster } from "react-hot-toast";
import { CiSearch } from "react-icons/ci";

import { AuthToken } from '../../context/AuthToken';
import { ConversationToken } from '../../context/ConversationToken';
import conversationApi from '../../api/conversationApi';


const ModalStyled = styled(Modal)`
    & + .modal-backdrop{
        z-index: 1059;
    }
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
						height: 32.2rem; 
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
	margin-top: 0.9rem;
	
	.cancel-btn, .confirm-btn {
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

	.confirm-btn {
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

const AddMemberModal = ({ show, handleClose, recentlyConversations, friends, currentMembers, setCurrentMembers}) => {
	const { user } = useContext(AuthToken);
    const [friendSearchInput, setFriendSearchInput] = useState('')
    const [checkedFriends, setCheckedFriends] = useState(currentMembers)
    const { conversationSelected, setConversationSelected, setMessages,setHaveNewMessageConversations } = useContext(ConversationToken);

    useEffect(() => {
        setCheckedFriends(currentMembers)
    }, [currentMembers])

    const handleCancelAddMember = () => {
        setFriendSearchInput('')
        setCheckedFriends(currentMembers)
        handleClose()
    }

    const handleConversationClick = (userId) => {
        if(!currentMembers.includes(userId)){
            setCheckedFriends(prevCheckedFriends => {
                if (prevCheckedFriends.includes(userId)) {
                    return prevCheckedFriends.filter(id => id !== userId);
                } else {
                    return [...prevCheckedFriends, userId];
                }
            });
        }
    };

    const handleAddMember = async () => {
        if(checkedFriends.length - currentMembers?.length > 0){
            try {
                const friendsToAddIntoGroup = checkedFriends.filter(friend => !currentMembers.includes(friend))
                //Call api thêm thành viên ở dây với 2 tham số conversationId, với danh sách userID muốn add
                const response = await conversationApi.addMemberIntoGroup(conversationSelected.conversationId, friendsToAddIntoGroup)
                let updatedParticipantIds = conversationSelected.participantIds.filter(participantId => !response.resData.addedParticipantIds.includes(participantId.participantId))
                updatedParticipantIds.push(...response.resData.addedParticipantIds)
                conversationSelected.membersInfo.push(...response.resData.membersInfo)
                conversationSelected.participantIds = updatedParticipantIds
                setConversationSelected((prev) => ({...conversationSelected}))
                setMessages((prevMessages) =>
                    prevMessages ? [...prevMessages, ...response.resData.messages] : [...response.resData.messages]
                );
                setHaveNewMessageConversations([{conversationId: conversationSelected.conversationId, message: response.resData.messages[response.resData.messages.length -1]}])
                const currentMembersIds = updatedParticipantIds.map(updatedParticipantId => updatedParticipantId.participantId)
                setCurrentMembers((prev) => ([...currentMembersIds]))
                handleCancelAddMember()
            } catch (error) {
                console.log(error)
            }
        }
    }

	return (
        <>
            <ModalStyled show={show} onHide={handleCancelAddMember}>
                <Toaster toastOptions={{ duration: 4000 }}/>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <Row className=" justify-content-between">
                            <Col md={12}>
                                <p className="m-0">Thêm thành viên</p>
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
                                        placeholder='Nhập tên, số điện thoại hoặc danh sách số điện thoại'
                                        value={friendSearchInput}
                                        onChange={(e) => setFriendSearchInput(e.target.value)}
                                    >
                                    </Form.Control>
                                </Form.Group>
                                <hr />
                                <Form.Group className="conversation-info-list">
                                    {friendSearchInput.trim() === "" ? (
                                        <>
                                            <Form.Label className='d-block mb-2'>
                                                <h6 className='fw-bold'>Trò chuyện gần đây</h6>
                                            </Form.Label>
                                            {recentlyConversations.map(conversation => {
                                                return (
                                                    <ConversationFormCheckStyled key={conversation.anotherParticipantId} className={currentMembers.includes(conversation.anotherParticipantId) ? 'disabled' : ''} onClick={() => handleConversationClick(conversation.anotherParticipantId)}>
                                                        <Form.Check
                                                            inline
                                                            value={conversation.anotherParticipantId}
                                                            type='checkbox'
                                                            id={`checkbox-${conversation.anotherParticipantId}`}
                                                            checked={checkedFriends.includes(conversation.anotherParticipantId)}
                                                        />
                                                        <Form.Label className="conversation-info-item">
                                                            <img 
                                                                src={conversation?.membersInfo?.find(
                                                                    (member) => member.userID !== user?.userID
                                                                )?.profilePic} 
                                                                alt=''
                                                            />
                                                            <div className='conversation-name'>
                                                                <span>
                                                                    {
                                                                        conversation?.name ||
                                                                        conversation?.membersInfo?.find(
                                                                            (member) => member.userID !== user?.userID
                                                                        )?.fullName
                                                                    }
                                                                </span>
                                                                {currentMembers.includes(conversation.anotherParticipantId) && (
                                                                    <span className='joined-label'>Đã tham gia</span>
                                                                )}
                                                            </div>
                                                        </Form.Label>
                                                    </ConversationFormCheckStyled>
                                                )
                                            })}
                                            <Form.Label className='d-block my-2'>
                                                <h6 className='fw-bold'>Bạn bè</h6>
                                            </Form.Label>
                                            {friends.map(friend => {
                                                return (
                                                    <ConversationFormCheckStyled key={friend.userID} className={currentMembers.includes(friend.userID) ? 'disabled' : ''} onClick={() => handleConversationClick(friend.userID)}>
                                                        <Form.Check
                                                            inline
                                                            value={friend.userID}
                                                            type='checkbox'
                                                            id={`checkbox-${friend.userID}`}
                                                            checked={checkedFriends.includes(friend.userID)}
                                                        />
                                                        <Form.Label className="conversation-info-item">
                                                            <img 
                                                                src={friend.profilePic} 
                                                                alt=''
                                                            />
                                                            <div className='conversation-name'>
                                                                <span>
                                                                    {
                                                                        friend.fullName
                                                                    }
                                                                </span>
                                                                {currentMembers.includes(friend.userID) && (
                                                                    <span className='joined-label'>Đã tham gia</span>
                                                                )}
                                                            </div>
                                                        </Form.Label>
                                                    </ConversationFormCheckStyled>
                                                )
                                            })}
                                        </>
                                    ) : (
                                        <>									

                                        </>
                                    )}
                                </Form.Group>
                            </Form>
                            <FormFooterStyled>
                                <Button className='cancel-btn mx-2' variant="secondary" onClick={handleCancelAddMember}>Hủy</Button>
                                <Button 
                                    className='confirm-btn' 
                                    variant="primary"
                                    disabled={checkedFriends.length - currentMembers?.length === 0}
                                    onClick={handleAddMember}
                                >
                                    Xác nhận
                                </Button>
                            </FormFooterStyled>
                        </Container>
                    )}
                </Modal.Body>
            </ModalStyled>
        </>
	);
};

export default AddMemberModal;
