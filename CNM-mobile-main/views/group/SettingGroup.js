import {
	View,
	Text,
	Image,
	TouchableOpacity,
	StyleSheet,
	Button,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ModalAddMember from './ModalAddMember';
import conversationApi from '../../api/conversationApi';
import {
	removeConversation,
	updateConversationMembers,
} from '../slide/ConsevationSlide';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import ModalListMember from './ModalListMember';
import ModalDetailInfo from './ModalDetailInfo';

const SettingGroup = () => {
	const navigation = useNavigation();
	const dispatch = useDispatch();
	const conversationDetails = useSelector(
		(state) => state.conservation?.conversationDetails
	);
	const profile = useSelector((state) => state.profile?.profile);
	const [modalVisible, setModalVisible] = useState(false);
	const [listMemberModal, setListMemberModal] = useState(false);
	const [detailMemberInfo, setDetailMemberInfo] = useState(false);
	const [notiModal, setNotiModal] = useState(false);
	const [notiMessage, setNotiMessage] = useState('');
	const [role, setRole] = useState(null); // Initialize as null
	const [conversationPic, setConversationPic] = useState('');
	const [other, setOther] = useState(null);
	const [detail, setDetail] = useState('');
	const [memberSelected, setMemberSelected] = useState(null);

	useEffect(() => {
		const roleUser = conversationDetails.participantIds.find(
			(participant) => participant.participantId === profile.userID
		);
		if (roleUser !== role) {
			setRole(roleUser);
		}
		
	}, [conversationDetails, profile.userID, role]);

	useEffect(() => {
		if (conversationDetails.membersInfo.length === 2) {
			let otherMember = conversationDetails.membersInfo.find(
				(member) => member?.userID !== profile?.userID
			);
			if (otherMember !== other) {
				setOther(otherMember);
				setConversationPic(otherMember.profilePic);
				setDetail(otherMember.fullName);
			}
		} else {
			setConversationPic(conversationDetails.avatar);
			setDetail(conversationDetails.name);
		}
	}, [conversationDetails, profile.userID, other]);

	const closeModal = useCallback(() => {
		setModalVisible(false);
	}, []);

	const closeModalListMembers = useCallback(() => {
		setListMemberModal(false);
	}, []);

	const showNoti = useCallback((message) => {
		setNotiMessage(message);
		setNotiModal(true);
	}, []);

	const handlerConfirmAddMembers = useCallback(
		async (checkedFriends) => {
			try {
				const res = await conversationApi.addMemberIntoGroup(
					conversationDetails.conversationId,
					checkedFriends
				);
				if (res) {
					dispatch(
						updateConversationMembers({
							addedParticipantIds:
								res.resData.addedParticipantIds,
							membersInfo: res.resData.membersInfo,
						})
					);
				}
			} catch (error) {
				console.error('Error when add member: ', error);
			} finally {
				setModalVisible(false);
			}
		},
		[conversationDetails.conversationId, dispatch]
	);

	const handlerAddMember = useCallback(() => {
		setModalVisible(true);
	}, []);

	const handlerShowDetailMemberModal = useCallback((member) => {
		setMemberSelected(member);
		setDetailMemberInfo(true);
	}, []);

	const handlerSelectMember = (member) => {
		setMemberSelected(member);
		setDetailMemberInfo(true);
	};

	const handlerRemoveGroup = useCallback(async () => {
		try {
			const res = await conversationApi.deleteConversation(
				conversationDetails.conversationId
			);
			if (res) {
				dispatch(
					removeConversation(conversationDetails.conversationId)
				);
				navigation.navigate('Home');
			}
		} catch (error) {
			console.error('Error when delete group: ', error);
		}
	}, [conversationDetails.conversationId, dispatch, navigation]);

	const handlerLeaveGroup = useCallback(async () => {
		if (conversationDetails.participantIds.length === 3) {
			showNoti('Số thành viên tối thiểu phải là 3 người');
			return;
		}
		try {
			let otherOwner;
			if (role.role === 'owner') {
				otherOwner = conversationDetails.participantIds.find(
					(participant) =>
						participant.participantId !== profile.userID
				);
			} else {
				otherOwner = conversationDetails.participantIds.find(
					(participant) =>
						participant.participantId === profile.userID
				);
			}
			const res = await conversationApi.leaveGroup(
				conversationDetails.conversationId,
				profile.userID,
				otherOwner
			);
			if (res) {
				navigation.navigate('Home');
			}
		} catch (error) {
			console.error('Error when leave group: ', error);
		}
	}, [
		conversationDetails.participantIds,
		conversationDetails.conversationId,
		role,
		profile.userID,
		showNoti,
		navigation,
	]);

	const handlerShowListMember = useCallback(() => {
		setListMemberModal(true);
	}, []);

	const closeModalDetailMember = useCallback(() => {
		setDetailMemberInfo(false);
	}, []);

	return (
		<View style={styles.container}>
			<Image source={{ uri: conversationPic }} style={styles.avatar} />
			<Text style={styles.groupName}>{detail}</Text>
			{conversationDetails.participantIds.length > 2 && (
				<Text style={styles.memberCount}>
					Số thành Viên {conversationDetails.participantIds.length}
				</Text>
			)}
			{conversationDetails.participantIds.length > 2 ? (
				<View style={styles.option}>
					<TouchableOpacity
						style={styles.optionItem}
						onPress={handlerAddMember}
					>
						<Text>Thêm thành viên</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.optionItem}
						onPress={handlerShowListMember}
					>
						<Text>Danh sách thành viên</Text>
					</TouchableOpacity>
					{role?.role === 'owner' && (
						<TouchableOpacity
							style={styles.optionItem}
							onPress={handlerRemoveGroup}
						>
							<Text style={{ color: 'red' }}>Giải tán nhóm</Text>
						</TouchableOpacity>
					)}
					<TouchableOpacity
						style={styles.optionItem}
						onPress={handlerLeaveGroup}
					>
						<Text style={{ color: 'red' }}>Rời khỏi nhóm</Text>
					</TouchableOpacity>
				</View>
			) : (
				<View style={styles.option}>
					<TouchableOpacity
						style={styles.optionItem}
						onPress={() => handlerShowDetailMemberModal(other)}
					>
						<Text>Thông tin cá nhân</Text>
					</TouchableOpacity>
				</View>
			)}

			<ModalAddMember
				isVisible={modalVisible}
				onClose={closeModal}
				onConfirm={handlerConfirmAddMembers}
			/>
			<ModalListMember
				isVisible={listMemberModal}
				onClose={closeModalListMembers}
				onClickMember={handlerSelectMember}
			/>
			<ModalDetailInfo
				isVisible={detailMemberInfo}
				onClose={closeModalDetailMember}
				infoMember={memberSelected}
			/>

			<Modal
				animationType="slide"
				isVisible={notiModal}
				onBackdropPress={() => setNotiModal(false)}
				onRequestClose={() => {
					setNotiModal(!notiModal);
				}}
			>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<Text style={styles.modalText}>{notiMessage}</Text>
						<Button
							title="Đóng"
							onPress={() => setNotiModal(!notiModal)}
						/>
					</View>
				</View>
			</Modal>
		</View>
	);
};

export default SettingGroup;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
	},
	avatar: {
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: 'white',
	},
	groupName: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	memberCount: {
		fontSize: 16,
		color: 'gray',
		marginBottom: 20,
	},
	option: {
		borderTopWidth: 1,
		flex: 1,
		width: '100%',
	},
	optionItem: {
		alignItems: 'center',
		fontSize: 20,
		fontWeight: 'bold',
		padding: 10,
		borderColor: 'gray',
		borderBottomWidth: 0.01,
	},
	friendListItem: {
		padding: 10,
		borderBottomWidth: 1,
		borderBottomColor: 'gray',
	},
	closeButton: {
		alignItems: 'center',
		backgroundColor: '#ddd',
		padding: 10,
	},
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
	},
	modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	modalText: {
		marginBottom: 15,
		textAlign: 'center',
	},
});
