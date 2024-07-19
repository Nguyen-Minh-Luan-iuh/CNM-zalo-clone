/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useContext, useEffect, useState } from 'react';
import { Col, Container, Modal, Row, Spinner } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import styled from 'styled-components';
import { toast, Toaster } from "react-hot-toast";
import { CiSearch } from "react-icons/ci";
import { FaCamera } from "react-icons/fa";

import conversationApi from '../../api/conversationApi';
import { AuthToken } from '../../context/AuthToken';
import { ConversationToken } from '../../context/ConversationToken'


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
						height: 28.6rem; 
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

const GroupInfoStyled = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 0.7rem;

    .group-avatar{
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 50%;
        border: 1px solid var(--border);

        margin-right: 0.6rem;
        img {
            width: 3rem;
            height: 3rem;
            object-fit: cover;
            border-radius: 50%;
        }
        .group-avatar-icon{
            margin: 0.8rem;
            font-size: 1.2rem;
            color: var(--text-secondary);
        }
    }

    .group-name-item{
        &:focus {
            box-shadow: none;
            border-color: var(--border-focused);
        }
        font-size: 0.9rem;
        border: none;
        border-radius: 0;
        padding-left: 0;
        border-bottom: 1px solid var(--border);
    }
`
const ModalUpdateGroupAvatarStyled = styled(Modal)`
    z-index: 1060;

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


const AddGroupModal = ({ show, handleClose, recentlyConversations, friends}) => {
	const { user } = useContext(AuthToken);
    const [friendSearchInput, setFriendSearchInput] = useState('')
    const [isShowUpdateGroupAvatarModal, setIsShowUpdateGroupAvatarModal] = useState(false)
    const [imagePreview, setImagePreview] = useState('');
    const [groupAvatar, setGroupAvatar] = useState('');
    const [groupName, setGroupName] = useState('')
    const [checkedFriends, setCheckedFriends] = useState([])
    const { setNewConversation } = useContext(ConversationToken);

    const handleCancelAddGroup = () => {
        setFriendSearchInput('')
        setGroupAvatar('')
        setCheckedFriends([])
        handleClose()
    }

    const handleImageChange = (e) => {
		const selectedImage = e.target.files[0];
		setImagePreview(selectedImage);
	};

    const handleUpdateGroupAvatar = () => {
        handleCancelUpdateAvatar()
        setGroupAvatar(imagePreview)
    }

    const handleCancelUpdateAvatar = () => {
        setIsShowUpdateGroupAvatarModal(false)
        setImagePreview('')
    }

    const handleConversationClick = (userId) => {
        setCheckedFriends(prevCheckedFriends => {
            if (prevCheckedFriends.includes(userId)) {
                return prevCheckedFriends.filter(id => id !== userId);
            } else {
                return [...prevCheckedFriends, userId];
            }
        });
    };

    const handleCreateGroup = async () => {
        if(checkedFriends.length < 2){
            toast.error("Vui lòng chọn ít nhất 2 người bạn để tạo nhóm")
        } else if (groupName.trim() === ''){
            toast.error("Vui lòng nhập tên nhóm")
        } else if (groupAvatar === ''){
            toast.error("Vui lòng chọn ảnh nhóm")
        } else {
            try {
                const res = await conversationApi.createConversation({
                    participantIds: [...checkedFriends, user.userID],
                    name: groupName,
                    avatar: groupAvatar
                });
                setNewConversation(res.conversation)
                handleCancelAddGroup()
            } catch (error) {
                console.log(error)
            }
        }
    }

	return (
        <>
            <ModalStyled show={show} onHide={handleCancelAddGroup}>
                <Toaster toastOptions={{ duration: 4000 }}/>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <Row className=" justify-content-between">
                            <Col md={12}>
                                <p className="m-0">Tạo nhóm</p>
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
                                <GroupInfoStyled>
                                    <div className='group-avatar' onClick={() => setIsShowUpdateGroupAvatarModal(true)}>
                                        {groupAvatar ? (
                                            <img src={URL.createObjectURL(groupAvatar)} alt=''/>
                                        ) : (
                                            <FaCamera className='group-avatar-icon' />
                                        )}
                                    </div>
                                    <Form.Control 
                                        className='group-name-item'
                                        type="text" 
                                        placeholder='Nhập tên nhóm...'
                                        value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)}
                                    >
                                    </Form.Control>
                                </GroupInfoStyled>
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
                                                    <ConversationFormCheckStyled key={conversation.anotherParticipantId}  onClick={() => handleConversationClick(conversation.anotherParticipantId)}>
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
                                            {friends.map(friend => {
                                                return (
                                                    <ConversationFormCheckStyled key={friend.userID} onClick={() => handleConversationClick(friend.userID)}>
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

                                        </>
                                    )}
                                </Form.Group>
                            </Form>
                            <FormFooterStyled>
                                <Button className='cancel-btn mx-2' variant="secondary" onClick={handleCancelAddGroup}>Hủy</Button>
                                <Button 
                                    className='update-btn' 
                                    variant="primary"
                                    disabled={checkedFriends.length < 2}
                                    onClick={handleCreateGroup}
                                >
                                    Tạo nhóm
                                </Button>
                            </FormFooterStyled>
                        </Container>
                    )}
                </Modal.Body>
            </ModalStyled>

            {isShowUpdateGroupAvatarModal && (
                <ModalUpdateGroupAvatarStyled show={isShowUpdateGroupAvatarModal} onHide={handleCancelUpdateAvatar}>
                    <Toaster toastOptions={{ duration: 4000 }}/>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <Row className=" justify-content-between">
                                <Col md={12}>
                                    <p className="m-0">Cập nhật ảnh đại diện</p>
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
                                                src={URL.createObjectURL(imagePreview)}
                                                alt="Preview Room Photo"
                                                style={{
                                                    maxWidth: '80%'
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                                {imagePreview && (
                                    <FormFooterStyled className='mt-5'>
                                        <Button className='cancel-btn mx-2' variant="secondary" onClick={handleCancelUpdateAvatar}>Hủy</Button>
                                        <Button 
                                            className='update-btn' 
                                            variant="primary" 
                                            onClick={handleUpdateGroupAvatar}
                                        >
                                            Cập nhật
                                        </Button>
                                    </FormFooterStyled>
                                )}
                            </>
                        )}
                    </Modal.Body>
                </ModalUpdateGroupAvatarStyled>
            )}
        </>
	);
};

export default AddGroupModal;
