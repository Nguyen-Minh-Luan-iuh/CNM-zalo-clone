import React, { useState } from 'react';
import {
	View,
	Text,
	Image,
	FlatList,
	StyleSheet,
	TouchableOpacity,
	Modal,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import conversationApi from '../../api/conversationApi';
import { setConversationDetails } from '../slide/ConsevationSlide';

const ModalListMember = ({ isVisible, onClose, onClickMember }) => {
	const dispatch = useDispatch();

	const conversationDetails = useSelector(
		(state) => state.conservation?.conversationDetails
	);
	const [confirmVisible, setConfirmVisible] = useState(false);
	const [optionsVisible, setOptionsVisible] = useState(false);
	const [selectedMember, setSelectedMember] = useState(null);

	const handleMemberPress = (member) => {
		setSelectedMember(member);
		setOptionsVisible(true);
	};

	const handleViewDetails = () => {
		onClickMember(selectedMember);
		setOptionsVisible(false);
	};

	const handleSetLeader = async () => {
		try {
			const res = await conversationApi.chanceRoleOwner(
				conversationDetails.conversationId,
				selectedMember.userID
			);
			if (res && res.resData) {
				dispatch(setConversationDetails(res.resData));
				console.log('Set leader response: ', res);
			}
		} catch (error) {
			console.error('Error setting leader: ', error);
		} finally {
			setOptionsVisible(false);
		}
	};

	const handleRemoveMember = async () => {
		try {
			const res = await conversationApi.removeMemberFromGroup(
				conversationDetails.conversationId,
				selectedMember.userID
			);
			if (res) {
				console.log('Remove member response: ', res);
			}
		} catch (error) {
			console.error('Error removing member: ', error);
		} finally {
			setConfirmVisible(false);
			setOptionsVisible(false);
		}
	};

	const renderMember = ({ item }) => {
		return (
			<TouchableOpacity
				style={styles.item}
				onPress={() => handleMemberPress(item)}
			>
				<Image
					source={{ uri: item.profilePic }}
					style={styles.profilePic}
				/>
				<Text style={styles.name}>{item.fullName}</Text>
				<Text>
					{
						conversationDetails.participantIds.find(
							(participant) =>
								item.userID === participant.participantId
						)?.role
					}
				</Text>
			</TouchableOpacity>
		);
	};

	return (
		<Modal
			animationType="slide"
			visible={isVisible}
			onRequestClose={onClose}
		>
			<View style={styles.modalView}>
				<FlatList
					data={conversationDetails.membersInfo}
					keyExtractor={(item) => item.userID.toString()}
					renderItem={renderMember}
				/>
				<TouchableOpacity style={styles.closeButton} onPress={onClose}>
					<Text>Đóng</Text>
				</TouchableOpacity>
			</View>
			{/* Options Modal */}
			<Modal
				visible={optionsVisible}
				transparent={true}
				animationType="fade"
				onRequestClose={() => setOptionsVisible(false)}
			>
				<View style={styles.centeredView}>
					<View style={styles.optionsModal}>
						<TouchableOpacity
							style={styles.optionButton}
							onPress={handleViewDetails}
						>
							<Text>Xem chi tiết</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.optionButton}
							onPress={handleSetLeader}
						>
							<Text>Chỉ định làm nhóm trưởng</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.optionButton}
							onPress={() => {
								setOptionsVisible(false);
								setConfirmVisible(true);
							}}
						>
							<Text>Xóa</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.optionButton}
							onPress={() => setOptionsVisible(false)}
						>
							<Text>Hủy</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
			<Modal
				visible={confirmVisible}
				transparent={true}
				animationType="fade"
				onRequestClose={() => setConfirmVisible(false)}
			>
				<View style={styles.centeredView}>
					<View style={styles.confirmationModal}>
						<Text style={styles.confirmationText}>
							Bạn có muốn xóa {selectedMember?.fullName}?
						</Text>
						<View style={styles.buttonRow}>
							<TouchableOpacity
								style={styles.confirmButton}
								onPress={handleRemoveMember}
							>
								<Text>Có</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.confirmButton}
								onPress={() => setConfirmVisible(false)}
							>
								<Text>Không</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</Modal>
	);
};

export default ModalListMember;

const styles = StyleSheet.create({
	modalView: {
		flex: 1,
		marginTop: 50,
		backgroundColor: 'white',
		padding: 20,
	},
	closeButton: {
		alignItems: 'center',
		backgroundColor: '#ddd',
		padding: 10,
	},
	item: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
	},
	profilePic: {
		width: 50,
		height: 50,
		borderRadius: 25,
		marginRight: 10,
	},
	name: {
		flex: 1,
		fontSize: 18,
	},
	// Additional styles for options modal
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	optionsModal: {
		backgroundColor: 'white',
		padding: 20,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		width: '80%',
		borderRadius: 10,
	},
	optionButton: {
		padding: 10,
		marginVertical: 5,
		backgroundColor: '#ddd',
		borderRadius: 5,
		width: '100%',
		alignItems: 'center',
	},
	// Additional styles for confirmation modal
	confirmationModal: {
		backgroundColor: 'white',
		padding: 20,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		width: '80%',
		borderRadius: 10,
	},
	confirmationText: {
		fontSize: 16,
		marginBottom: 20,
	},
	buttonRow: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		width: '100%',
	},
	confirmButton: {
		padding: 10,
		backgroundColor: '#ddd',
		borderRadius: 5,
	},
});
