import styled from 'styled-components';
import { useContext, useEffect, useState } from 'react';
import Tippy from '@tippyjs/react/headless';
import { MdArrowBackIos } from "react-icons/md";
import { AiOutlineEdit, AiOutlineUsergroupAdd } from "react-icons/ai";
import { TbBellRinging } from "react-icons/tb";
import { BsPinAngle } from "react-icons/bs";
import { LuUsers } from "react-icons/lu";
import { FiTrash } from "react-icons/fi";
import { RxExit } from "react-icons/rx";
import { FaEllipsisH } from 'react-icons/fa';
import { RiKey2Line } from "react-icons/ri";
import { IoKeyOutline } from "react-icons/io5";
import { toast, Toaster } from "react-hot-toast";
import { ConversationToken } from '../../context/ConversationToken';
import { AuthToken } from '../../context/AuthToken';
import ConfirmModal from '../modals/ConfirmModal';
import DeleteGroupModal from '../modals/DeleteGroupModal';
import AddMemberModal from '../modals/AddMemberModal';
import ChangeGroupOwnerModal from '../modals/ChangeGroupOwnerModal';
import LeaveGroupModal from '../modals/LeaveGroupModal';
import conversationApi from '../../api/conversationApi';
import userApi from '../../api/userApi';

const WrapperStyled = styled.div`;
    width: 33.5%;
    border-left: 1px solid var(--border);
`;

const ConversationInfoHeaderStyled = styled.div`;
    height: 68px;
    user-select: none;
    border-bottom: 1px solid var(--border);
    display: flex;
	justify-content: center;
	align-items: center; 
    position: relative;

    .conversation-info-title{
        font-weight: 600;
        font-size: 1.1rem;
        margin: 0;
    }

    .back-conversation-info-icon {
        position: absolute;
        top: 1.45rem;
        left: 1.3rem;
        font-size: 1.2rem;
        cursor: pointer;
    }
`;

const ConversationInfoBodyStyled = styled.div`;
    height: calc(100vh - 68px);
    overflow-y: auto;
    /* Ẩn thanh cuộn cho các trình duyệt Chrome */
	&::-webkit-scrollbar {
		display: none;
	}

	/* Tùy chỉnh thanh cuộn cho các trình duyệt khác */
	scrollbar-width: none; /* Ẩn thanh cuộn */
	-ms-overflow-style: none; /* Ẩn thanh cuộn cho IE/Edge */
`;

const GroupInfoStyled = styled.div`;
    padding: 1rem 1rem 0.6rem 1rem;
    
    .group-avatar{
        height: 4.5rem;
        display: flex;
        justify-content: center;
        align-items: center; 

        img{
            width: 3.4rem;
            height: 3.4rem;
            border-radius: 50%;
            object-fit: cover;
        }
    }

    .group-name{
        height: 2.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        
        span {
            position: relative;
            font-weight: 600;

            .edit-group-name-icon{
                height: 1.4rem;
                width: 1.4rem;
                font-size: 1.5rem;
                position: absolute;
                right: -2rem;
                padding: 0.2rem;
                border-radius: 50%;
                background-color: var(--button-neutral-normal);
                color: var(--button-neutral-text);
                cursor: pointer;
                &:hover{
                    background-color: var(--button-neutral-hover);
                }
            }
        }

    }

    .group-info-action{
        height: 5rem;
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-top: 0.6rem;

        .group-info-action-detail{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .group-info-action-icon{
                padding: 0.4rem;
                font-size: 2rem;
                border-radius: 50%;
                background-color: var(--button-neutral-normal);
                color: var(--button-neutral-text);
                cursor: pointer;
                &:hover{
                    background-color: var(--button-neutral-hover);
                }
            }

            span{
                font-size: 0.76rem;
                color: var(--text-secondary);
                width: 4rem;
                text-align: center;
                margin-top: 0.5rem;
            }
        }
    }
`;

const SeparatedStyled = styled.div`;
    height: 0.5rem;
    background: #eef0f1;
`;

const MemberInfoStyled = styled.div`;
    padding: 0.8rem 0 0;

    h6 {
        padding: 0 1rem 0.14rem;
        font-weight: 600;
        font-size: 0.94rem;
    }

    .member-info-item{
        display: flex;
        align-items: center;
        padding: 0.845rem 1rem;
        cursor: pointer;
        &:hover {
            background-color: var(--layer-background-hover);
        }

        .member-info-icon {
            font-size: 1.28rem;
        }
        span{
            margin-left: 0.6rem;
            font-size: 0.875rem;
        }
    }
`;

const SecuritySettingStyled = styled.div`;
    padding: 0.8rem 0 0;

    h6 {
        padding: 0 1rem 0.14rem;
        font-weight: 600;
        font-size: 0.94rem;
    }

    .security-setting-item{
        display: flex;
        align-items: center;
        padding: 0.845rem 1rem;
        cursor: pointer;
        &:hover {
            background-color: var(--layer-background-hover);
        }
        color:  var(--text-errors);

        .security-setting-icon {
            font-size: 1.28rem;
        }
        span{
            margin-left: 0.6rem;
            font-size: 0.875rem;
        }
    }
`;

const ManageGroupStyled = styled.div`;
    padding: 0.8rem 0 0;

    h6 {
        padding: 0 1rem 0.14rem;
        font-weight: 600;
        font-size: 0.94rem;
    }

    .manage-group-item{
        display: flex;
        align-items: center;
        padding: 0.845rem 1rem;
        cursor: pointer;
        &:hover {
            background-color: var(--layer-background-hover);
        }

        .manage-group-icon {
            font-size: 1.28rem;
        }
        span{
            margin-left: 0.6rem;
            font-size: 0.875rem;
        }
    }

    &.disable{
        opacity: 0.5;
        cursor: not-allowed;

        > *{
            cursor: not-allowed;
            pointer-events:none;
        }
    }
`;

const DeleteGroupStyled = styled.div`;
    padding: 1.9rem 1rem;

    .delete-group-item{
        padding: 0.45rem;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--button-secondary-danger-normal);
        color: var(--button-secondary-danger-text);
        font-weight: 600;
        font-size: 0.98rem;
        cursor: pointer;
        border-radius: 0.2rem;

        &:hover {
            background-color: var(--button-secondary-danger-hover);
        }
    }

    &.disable{
        opacity: 0.5;
        cursor: not-allowed;

        > *{
            cursor: not-allowed;
            pointer-events:none;
        }
    }
`;

const AddMemberStyled = styled.div`
    padding: 1rem;

    .add-member-item{
        padding: 0.4rem;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        border-radius: 0.2rem;
        background-color: var(--button-neutral-normal);
        color: var(--button-neutral-text);

        span{
            font-size: 0.94rem;
            margin-left: 0.2rem;
        }

        &:hover {
            background-color: var(--button-neutral-hover);
        }
    }
`

const MemberListStyled = styled.div`
    .member-list-title {
        font-weight: 600;
        font-size: 0.875rem;
        padding: 0.4rem 1rem 1rem;
        margin: 0;
    }

    .member-info-item{
        display: flex;
        align-items: center;
        padding: 0.8rem 1rem;
        cursor: pointer;

        &:hover {
            background-color: var(--layer-background-hover);

            .member-info-detail{
                .member-action{
                    visibility: visible;
                }
            }
        }

        .member-avatar{
            position: relative;
            padding-right: 0.65rem;
            img{
                width: 2.4rem;
                height: 2.4rem;
                border-radius: 50%;
                object-fit: cover;
            }

            .group-owner-icon{
                position: absolute;
                color: #ffd95c;
                bottom: 0rem;
                right: 0.5rem;
                background-color: rgba(0, 0, 0, 0.6);
                border-radius: 50%;
                padding: 0.1rem;
                font-size: 0.95rem;
            }
        }

        .member-info-detail{
            flex: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .member-name-and-role{
                font-size: 0.87rem;
                display: flex;
                flex-direction: column;
                justify-content: center;
    
                .member-name {
                    font-weight: 600;
                }
            }
    
            .member-action{
                font-size: 1rem;
                height:2rem;
                width: 2rem;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 0.2rem;
                visibility: hidden;

                &:hover {
                    background-color: var(--button-tertiary-neutral-hover);
                }

                .member-action-icon{
                    margin: 0;
                }
            }
        }
    }
`

const PopperWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    border-radius: 0.3rem;
    background: rgb(255, 255, 255);
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    overflow: hidden;
    padding: 8px 0;

    .action-wrapper {
        align-items: center;
        min-width: 156px;
        padding: 3px 12px;
        font-size: 0.875rem;
        cursor: pointer;
        border: 1px solid transparent;
        user-select: none;
        width: 100%;
        justify-content: flex-start;
        line-height: 1.8rem;

        &.separate {
            border-bottom: 1px solid rgba(22, 24, 35, 0.12);
        }
    
        &:hover {
            background-color: rgba(22, 24, 35, 0.03);
        }
    }
`;

const ConversationInfo = () => {
    const { toggleConversationInfo, setToggleConversationInfo, conversationSelected } = useContext(ConversationToken);
    const { user } = useContext(AuthToken);
    const [showMemberActionTippy, setShowMemberActionTippy] = useState('')
    const [showConfirm, setShowConfirm] = useState(false);
    const [memberIdForDelete, setMemberIdForDelete] = useState('')
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [recentlyConversations, setRecentlyConversations] = useState([])
    const [friendsWithConversationId, setFriendsWithConversationId] = useState([])
    const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false)
    const [currentMembers, setCurrentMembers] = useState([])
    const [showChangeGroupOwnerModal, setShowChangeGroupOwnerModal] = useState(false)
    const [showLeaveGroupModal, setShowLeaveGroupModal] = useState(false)

    useEffect(() => {
        setCurrentMembers(() => (conversationSelected?.participantIds
            ?.map(participantId => participantId.participantId)))
    }, [conversationSelected])

    const isGroupOwner = (userID) => {
        return conversationSelected?.participantIds.find(participantId => participantId.role === "owner")?.participantId === userID;
    }

    const MENU_ITEMS_FOR_MEMBERS = [
        {
            title: 'Xóa khỏi nhóm',
            separate: false,
            handleClick: (memberId) => handleDeleteMemberOutOfGroup(memberId)
        }
    ];

    const MENU_ITEMS_FOR_OWNER = [
        {
            title: 'Rời nhóm',
            separate: false,
            handleClick: (memberId) => alert(memberId)
        }
    ]

    const handleDeleteMemberOutOfGroup = (memberId) => {
        if(conversationSelected?.participantIds.length <= 3){
            toast.error("Không thể xóa vì nhóm phải có ít nhất 3 thành viên.")
        } else {
            setMemberIdForDelete(memberId)
            setShowConfirm(true)
        }
    }

    const renderItems = (memberId) => {
        const MENU_ITEMS = isGroupOwner(memberId) ? MENU_ITEMS_FOR_OWNER : MENU_ITEMS_FOR_MEMBERS
        return MENU_ITEMS.map((item, index) => (
            <div  
                key={index} 
                className={`
                    action-wrapper 
                    ${item.separate ? 'separate' : ''} 
                `} 
                onClick={() => item.handleClick(memberId)}
            >
                <span className='title'>{item.title}</span>
            </div>
        ))
    }

    const renderMemberActions = (props) => {
        return (
            <div tabIndex="-1" {...props}>
                <PopperWrapper>
                    {renderItems(props)}
                </PopperWrapper>
            </div>
        );
    };

    const handleShowMemberActionTippy = (e, memberId) => {
        e.stopPropagation();
        setShowMemberActionTippy(memberId)
    }

    window.addEventListener("click", (e) => {
		if(showMemberActionTippy !== '') {
            setShowMemberActionTippy('')
        }
    });

    useEffect(() => {
        if(showAddMemberModal){
            getRecentlyConversations(5)
            getAllFriendsWithConversationId()
        }
    }, [showAddMemberModal])

    const getRecentlyConversations = async (quantity) => {
        try {
            const res = await conversationApi.getRecentlyFriendConversations(quantity);
			console.log(res.conversations)
            setRecentlyConversations(res.conversations)
        } catch (error) {
            console.log(error)
        }
    }

    const getAllFriendsWithConversationId = async () => {
        try {
            const res = await userApi.getAllFriendsWithConversationId();
			console.log(res.friends)
            setFriendsWithConversationId(res.friends)
        } catch (error) {
            console.log(error)
        }
    }

    const handleLeaveGroup = () => {
        if(conversationSelected?.participantIds.length <= 3){
            toast.error("Không thể rời nhóm vì nhóm phải có ít nhất 3 thành viên.")
        } else {
            setShowLeaveGroupModal(true)
        }
    }

    const items = [
		{
			key: 'group-info',
			title: 'Thông tin nhóm',
            body: (
                <>
                    <GroupInfoStyled>
                        <div className='group-avatar'>
                            <img src={conversationSelected?.avatar} alt=''/>
                        </div>
                        <div className='group-name'>
                            <span>
                                {conversationSelected?.name}
                                <AiOutlineEdit className='edit-group-name-icon'/>
                            </span>
                        </div>
                        <div className='group-info-action'>
                            <div className='group-info-action-detail'>
                                <TbBellRinging className='group-info-action-icon'/>
                                <span>Tắt thông báo</span>
                            </div>
                            <div className='group-info-action-detail'>
                                <BsPinAngle className='group-info-action-icon'/>
                                <span>Ghim hội thoại</span>
                            </div>
                            <div className='group-info-action-detail'>    
                                <AiOutlineUsergroupAdd className='group-info-action-icon'/>
                                <span>Thêm thành viên</span>
                            </div>
                        </div>
                    </GroupInfoStyled>
                    <SeparatedStyled></SeparatedStyled>
                    <MemberInfoStyled>
                        <h6>Thành viên nhóm</h6>
                        <div className='member-info-item' onClick={() => setToggleConversationInfo({toggle: true, level: 1})}>
                            <LuUsers className='member-info-icon'/>
                            <span>{conversationSelected?.participantIds.length} thành viên</span>
                        </div>
                    </MemberInfoStyled>
                    <SeparatedStyled></SeparatedStyled>
                    <SecuritySettingStyled>
                        <h6>Thiết lập bảo mật</h6>
                        <div className='security-setting-item'>
                            <FiTrash className='security-setting-icon'/>
                            <span>Xóa lịch sử trò chuyện</span>
                        </div>
                        <div className='security-setting-item' onClick={() => handleLeaveGroup()}>
                            <RxExit className='security-setting-icon'/>
                            <span>Rời nhóm</span>
                        </div>
                    </SecuritySettingStyled>
                    <SeparatedStyled></SeparatedStyled>
                    <ManageGroupStyled className={isGroupOwner(user.userID) ? '' : 'disable'}>
                        <h6>Quản lý nhóm</h6>
                        <div className='manage-group-item' onClick={() => setShowChangeGroupOwnerModal(true)}>
                            <IoKeyOutline className='manage-group-icon'/>
                            <span>Chuyển quyền trưởng nhóm</span>
                        </div>
                    </ManageGroupStyled>
                    <SeparatedStyled></SeparatedStyled>
                    <DeleteGroupStyled className={isGroupOwner(user.userID) ? '' : 'disable'} onClick={() => setShowDeleteGroupModal(true)}>
                        <div className='delete-group-item'>
                            <span>Giải tán nhóm</span>
                        </div>
                    </DeleteGroupStyled>
                </>
            )
		},
		{
			key: 'members-info',
			title: 'Thành viên',
            body: (
                <>
                    <AddMemberStyled>
                        <div className='add-member-item' onClick={() => setShowAddMemberModal(true)}>
                            <AiOutlineUsergroupAdd/>
                            <span>Thêm thành viên</span>
                        </div>
                    </AddMemberStyled>
                    <MemberListStyled>
                        <h6 className='member-list-title'>
                            Danh sách thành viên ({conversationSelected?.participantIds.length})
                        </h6>
                        {conversationSelected?.membersInfo?.map(member => {
                            return (
                                <div className='member-info-item'>
                                    <div className='member-avatar'>
                                        <img src={member.profilePic} alt=''/>
                                        {isGroupOwner(member.userID) && (
                                            <RiKey2Line className='group-owner-icon'/>
                                        )}
                                    </div>
                                    <div className='member-info-detail'>
                                        <div className='member-name-and-role'>
                                            <span className='member-name'>{member.userID === user.userID ? "Bạn" : member.fullName}</span>
                                            {isGroupOwner(member.userID) && (
                                                <span className='member-role'>Trưởng nhóm</span>    
                                            )}
                                        </div>
                                        {isGroupOwner(user.userID) && (
                                            <Tippy
                                                visible={member.userID === showMemberActionTippy}
                                                interactive
                                                delay={[0, 0]}
                                                offset={[0, 0]}
                                                placement="bottom-end"
                                                render={() => renderMemberActions(member.userID)}
                                            >
                                                <div className='member-action' onClick={(e) => handleShowMemberActionTippy(e, member.userID)}>
                                                    <FaEllipsisH className='member-action-icon'/>
                                                </div>
                                            </Tippy>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </MemberListStyled>
                </>
            )
		}
        ,
		{
			key: 'conversation-info',
			title: 'Thông tin hội thoại',
            body: (
                <>
                    <GroupInfoStyled>
                        <div className='group-avatar'>
                            <img 
                                src={
                                    conversationSelected?.avatar ||
                                    conversationSelected?.membersInfo?.find(
                                    (member) => member.userID !== user?.userID
                                )?.profilePic} 
                                alt=''
                            />
                        </div>
                        <div className='group-name'>
                            <span>
                                {
                                    conversationSelected?.name ||
                                    conversationSelected?.membersInfo?.find(
                                        (member) => member.userID !== user?.userID
                                    )?.fullName
                                }
                                <AiOutlineEdit className='edit-group-name-icon'/>
                            </span>
                        </div>
                        <div className='group-info-action'>
                            <div className='group-info-action-detail'>
                                <TbBellRinging className='group-info-action-icon'/>
                                <span>Tắt thông báo</span>
                            </div>
                            <div className='group-info-action-detail'>
                                <BsPinAngle className='group-info-action-icon'/>
                                <span>Ghim hội thoại</span>
                            </div>
                        </div>
                    </GroupInfoStyled>
                    <SeparatedStyled></SeparatedStyled>
                    <SecuritySettingStyled>
                        <h6>Thiết lập bảo mật</h6>
                        <div className='security-setting-item'>
                            <FiTrash className='security-setting-icon'/>
                            <span>Xóa lịch sử trò chuyện</span>
                        </div>
                    </SecuritySettingStyled>
                    <SeparatedStyled></SeparatedStyled>
                </>
            )
		}
	];

    return (
        <>
            {toggleConversationInfo?.toggle && (
                <WrapperStyled>
                    <Toaster toastOptions={{ duration: 4000 }}/>
                    <ConversationInfoHeaderStyled>
                        {toggleConversationInfo?.level === 1 && (
                            <MdArrowBackIos className='back-conversation-info-icon' onClick={() => setToggleConversationInfo({toggle: true, level: conversationSelected.participantIds.length > 2 ? 0 : 2})}/>
                        )}
                        <h5 className='conversation-info-title'>{items[toggleConversationInfo?.level].title}</h5>
                    </ConversationInfoHeaderStyled>
                    <ConversationInfoBodyStyled>
                        {items[toggleConversationInfo?.level].body}
                    </ConversationInfoBodyStyled>
                    <ConfirmModal 
                        memberIdForDelete={memberIdForDelete} 
                        show={showConfirm} 
                        handleClose={() => setShowConfirm(false)} 
                        setCurrentMembers={setCurrentMembers}
                    />
                    <AddMemberModal
                        show={showAddMemberModal}
                        handleClose={() => setShowAddMemberModal(false)}
                        recentlyConversations={recentlyConversations}
                        friends={friendsWithConversationId}
                        currentMembers={
                            currentMembers.length > 0 ? currentMembers : (
                                conversationSelected?.participantIds
                                ?.map(participantId => participantId.participantId) || []
                            )
                        }
                        setCurrentMembers={setCurrentMembers}
                    />
                    <DeleteGroupModal show={showDeleteGroupModal} handleClose={() => setShowDeleteGroupModal(false)}/>
                    <ChangeGroupOwnerModal 
                        membersInfo={conversationSelected?.membersInfo.filter(member => member.userID !== user.userID)} 
                        show={showChangeGroupOwnerModal} 
                        handleClose={() => setShowChangeGroupOwnerModal(false)}
                    />
                    <LeaveGroupModal  
                        isOwner={isGroupOwner(user.userID)}
                        show={showLeaveGroupModal} 
                        handleClose={() => setShowLeaveGroupModal(false)}
                        membersInfo={conversationSelected?.membersInfo.filter(member => member.userID !== user.userID)} 
                    />
                </WrapperStyled>
            )}
        </>
    )
}

export default ConversationInfo