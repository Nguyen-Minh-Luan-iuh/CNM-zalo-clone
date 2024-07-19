/* eslint-disable array-callback-return */
import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { AuthToken } from '../../context/AuthToken';
import { ConversationToken } from '../../context/ConversationToken';
import Button from '../common/Button';
import { SiTinyletter } from "react-icons/si";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { GrGroup } from "react-icons/gr";
import { CgUserList } from "react-icons/cg";
import { GrSend } from "react-icons/gr";
import userApi from '../../api/userApi';
import { toast, Toaster } from "react-hot-toast";
import conversationApi from '../../api/conversationApi';
import LeaveGroupModal from '../modals/LeaveGroupModal';

const HeaderChatStyled = styled.h3`
    display: flex;
    margin: 0;
    text-align: left;
    align-items: center;
    padding: 1.38rem 1.2rem;

    font-size: 0.975rem;
    font-weight: 600;
    user-select: none;
    border-bottom: 1px solid var(--border-disabled);
`;

const InfoStyled = styled.div`
    flex: 1;
	display: flex;
	padding: 0.25rem 0;
	cursor: pointer;

	img {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		background-color: white;
		border: 1px solid var(--color-60);
		margin-right: 0.5rem;
	}
	> div {
		> * {
			margin: 0;
		}
		p {
			color: #777;
			font-size: 0.75rem;
		}
	}
`;

const WrapContentStyled = styled.div`
    padding: 1rem;
    display: flex;
`;

const WrapContent = styled.div`
    padding: 0.7rem 1rem;
    display: flex;
    &:hover{
        background: var(--layer-background-hover);
    }
`;


const AsideStyled = styled.aside`
	width: 100%;
	height: 100vh;
	position: sticky;
	top: 0;
	box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.16);

	background-color: rgba(0, 0, 0, 0.01);
`;

const ContentList = styled.div`
    width: 100%;
`;

const GroupListSection = styled.div`
    // Thêm các CSS cần thiết cho phần danh sách bạn bè
`;


const ListFriend = () => {
    const { user, setUser } = useContext(AuthToken);
    const { conversationSelected, toggleConversationInfo, setToggleConversationInfo, setNewConversation, conversations } =
    useContext(ConversationToken);
    const [requestedFriends, setRequestedFriends] = useState([]);
    const [requestAddFriendsReceived, setRequestAddFriendsReceived] = useState([]);
    const [listFriend, setListFriend] = useState([]);
    const [listGroup, setListGroup] = useState([])
    const [showLeaveGroupModal, setShowLeaveGroupModal] = useState(false)
    const [groupSelected, setGroupSelected] = useState(null)

    const isGroupOwner = (userID) => {
        return groupSelected?.participantIds.find(participantId => participantId.role === "owner")?.participantId === userID;
    }

    useEffect(() => {
        if (conversationSelected && conversationSelected.icon === 'GrSend') {
            fetchRequestedFriends(user?.listRequestAddFriendsSent);
        }
        if (conversationSelected && conversationSelected.icon === 'SiTinyletter') {
            fetchRequestAddFriendsReceived(user?.listRequestAddFriendsReceived);
        }
        if (conversationSelected && conversationSelected.icon === 'GrGroup') {
            fetchListGroup();
        }
        if (conversationSelected && conversationSelected.icon === 'CgUserList') {
            fetchListFriend(user?.friends);
        }
    }, [conversationSelected, user?.friends, user?.listRequestAddFriendsReceived, user?.listRequestAddFriendsSent]);

    const fetchRequestedFriends = async (userIds) => {
        try {
            if(userIds.length > 0){
                const requests = await userApi.findUsersByIds({userIds: userIds})
                setRequestedFriends(requests.users);
            } else {
                setRequestedFriends([])
            }
        } catch (error) {
            console.error("Error fetching requested friends:", error);
        }
    };

    const fetchRequestAddFriendsReceived = async (userIds) => {
        try {
            if(userIds.length > 0){
                const requests = await userApi.findUsersByIds({userIds: userIds})
                setRequestAddFriendsReceived(requests.users);
            } else {
                setRequestAddFriendsReceived([])
            }
        } catch (error) {
            console.error("Error fetching requested friends:", error);
        }
    };

    const fetchListGroup = async () => {
        try {
            const res = await conversationApi.getAllGroupConversationsOfUser()
            setListGroup(res.conversations);
        } catch (error) {
            console.error("Error fetching requested friends:", error);
        }
    };

    const fetchListFriend = async (userIds) => {
        try {
            if(userIds.length > 0){
                const requests = await userApi.findUsersByIds({userIds: userIds})
                setListFriend(requests.users);
            } else {
                setListFriend([]);
            }
        } catch (error) {
            console.error("Error fetching requested friends:", error);
        }
    };

    if (!conversationSelected) {
        return null; // or you can return a loading indicator or default content
    }
    
    let IconComponent;

	switch (conversationSelected.icon) {
		case 'CgUserList':
			IconComponent = CgUserList;
			break;
		case 'GrGroup':
			IconComponent = GrGroup;
			break;
		case 'SiTinyletter':
			IconComponent = SiTinyletter;
			break;
        case 'GrSend':    
            IconComponent = GrSend;
            break;
		default:
			IconComponent = LiaUserFriendsSolid;
	}

    console.log("conversationSelected",conversationSelected); 
    
    const handleCancelFriendRequest = async (requestedFriend) => {
        try {
            const res = await userApi.cancelFriend(user.userID, requestedFriend.userID);
            setRequestedFriends(prevFriends => prevFriends.filter(friend => friend.userID !== res.canceledFriend))
            setUser(prevUser => ({
				...prevUser,
				listRequestAddFriendsSent: prevUser.listRequestAddFriendsSent.filter(friend => friend !== res.canceledFriend)
			}));
            toast.success("Thu hồi lời mời kết bạn thành công");
        } catch (error) {
            console.error("Error canceling friend request:", error);
        }
	};

    const handleCancelRequestAddFriend = async (requestedFriend) => {
        try {
            const res = await userApi.cancelRequestAddFriends(user.userID, requestedFriend.userID);
            setRequestAddFriendsReceived(prevFriends => prevFriends.filter(friend => friend.userID !== res.refusedFriend))
            setUser(prevUser => ({
				...prevUser,
                listRequestAddFriendsReceived: prevUser.listRequestAddFriendsReceived.filter(friend => friend !== res.refusedFriend)
			}));
            toast.success("Từ chối yêu cầu kết bạn thành công");
        } catch (error) {
            console.error("Error canceling friend request:", error);
        }
	};

    const handleSuccessAddFriendRequest = async (requestedFriend) => {
        // console.log("requestedFriend",user.userID +","+ requestedFriend.user.userID);
        try {
            const res = await userApi.addFriend(user.userID, requestedFriend.userID);
            setListFriend(prevFriends => [...prevFriends, res.data.acceptedFriend]);
            setRequestAddFriendsReceived(prevFriends => prevFriends.filter(friend => friend.userID !== res.data.acceptedFriend))
            setUser(prevUser => ({
				...prevUser,
				friends: [...(prevUser.friends || []), res.data.acceptedFriend],
                listRequestAddFriendsReceived: prevUser.listRequestAddFriendsReceived.filter(friend => friend !== res.data.acceptedFriend)
			}));
            const isExistedConversation = conversations.some(conversation => conversation.conversationId === res.data.conversation.conversationId)
            if(!isExistedConversation) {
				setNewConversation(res.data.conversation)
            } 
            toast.success("Đồng ý kết bạn thành công");
        } catch (error) {
            console.error("Error canceling friend request:", error);
        }

    };

    const handleDeleteFriend = async (requestedFriend) => {
        try {
            const res = await userApi.deleteFriend(user.userID, requestedFriend.userID);
            setListFriend(prevFriends => prevFriends.filter(friend => friend.userID !== res.deletedUser))
            setUser(prevUser => ({
				...prevUser,
				friends: prevUser.friends.filter(friend => friend !== res.deletedUser)
			}));
            toast.success("Xóa bạn thành công");
        } catch (error) {
            console.error("Error canceling friend request:", error);
        }
    }

    const handleLeaveGroup = (group) => {
        if(group?.participantIds.length <= 3){
            toast.error("Không thể rời nhóm vì nhóm phải có ít nhất 3 thành viên.")
        } else {
            setGroupSelected(group)
            setShowLeaveGroupModal(true)
        }
    }

    return (
        <>
            <AsideStyled>
                <HeaderChatStyled>
                    <IconComponent size={26} style={{ marginRight: '1rem' }} />
                    {conversationSelected?.name}
                </HeaderChatStyled>
                <WrapContentStyled>
                    <Toaster toastOptions={{ duration: 1500 }} />
                    {/* Hiển thị danh sách bạn, danh sách bạn bè hoặc danh sách lời mời kết bạn tương ứng */}
                    {conversationSelected.icon === 'CgUserList' && (
                        <ContentList>
                           {listFriend.map(requestedFriend => (
                                <WrapContent key={requestedFriend.userID}>
                                    <InfoStyled>
                                        <img src={requestedFriend?.profilePic} alt="" />
                                        <div>
                                            <b>{requestedFriend?.fullName}</b>
                                            <p>{requestedFriend?.phoneNumber}</p>
                                        </div>
                                    </InfoStyled>
                                    <div className="d-flex align-items-center">
                                        <Button className="py-2 danger"  onClick={() => handleDeleteFriend(requestedFriend)}>Xóa bạn</Button>
                                    </div>
                                </WrapContent>
                            ))}
                        </ContentList>
                    )}
                    {conversationSelected.icon === 'GrGroup' && (
                        <ContentList>
                            {listGroup.map(group => (
                                <WrapContent key={group.conversationId}>
                                    <InfoStyled>
                                        <img src={group.avatar} alt="" />
                                        <div>
                                            <b>{group.name}</b>
                                            <p>{group.participantIds.length} thành viên</p>
                                        </div>
                                    </InfoStyled>
                                    <div className="d-flex align-items-center">
                                        <Button className="py-2 danger" onClick={() => handleLeaveGroup(group)}>Rời nhóm</Button>
                                    </div>
                                </WrapContent>
                            ))}
                        </ContentList>
                    )}
                    {conversationSelected.icon === 'SiTinyletter' && (
                        <ContentList>
                            {requestAddFriendsReceived.map(requestedFriend => (
                                <WrapContent key={requestedFriend.userID}>
                                    <InfoStyled>
                                        <img src={requestedFriend.profilePic} alt="" />
                                        <div>
                                            <b>{requestedFriend.fullName}</b>
                                            <p>{requestedFriend.phoneNumber}</p>
                                        </div>
                                    </InfoStyled>
                                    <div className="d-flex align-items-center p-2">
                                        <Button className="py-2 danger"  onClick={() => handleCancelRequestAddFriend(requestedFriend)}>Từ chối</Button>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <Button className="py-2"  onClick={() => handleSuccessAddFriendRequest(requestedFriend)}>Đồng ý</Button>
                                    </div>
                                </WrapContent>
                            ))}
                   
                        </ContentList>
                    )}
                    {conversationSelected.icon === 'GrSend' && (
                        <ContentList>
                            {/* Lập qua danh sách  */}
                            {requestedFriends.map(requestedFriend => (
                                <WrapContent key={requestedFriend.userID}>
                                    <InfoStyled>
                                        <img src={requestedFriend.profilePic} alt="" />
                                        <div>
                                            <b>{requestedFriend.fullName}</b>
                                            <p>{requestedFriend.phoneNumber}</p>
                                        </div>
                                    </InfoStyled>
                                    <div className="d-flex align-items-center">
                                        <Button className="py-2 danger"  onClick={() => handleCancelFriendRequest(requestedFriend)}>Thu hồi</Button>
                                    </div>
                                </WrapContent>
                            ))}
                        </ContentList>
                    )}
                    {groupSelected && (<LeaveGroupModal  
                        groupSelected={groupSelected}
                        isOwner={isGroupOwner(user.userID)}
                        show={showLeaveGroupModal} 
                        handleClose={() => setShowLeaveGroupModal(false)}
                        membersInfo={groupSelected?.membersInfo.filter(member => member.userID !== user.userID)} 
                        listGroup={listGroup}
                        setListGroup={setListGroup}
                    />)}
                </WrapContentStyled>
            </AsideStyled>
        </>
    );
};

export default ListFriend;
