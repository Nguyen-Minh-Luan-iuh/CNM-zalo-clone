import {
	View,
	Text,
	FlatList,
	StyleSheet,
	Image,
	TouchableOpacity,
	CheckBox,
} from 'react-native';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Modal from 'react-native-modal';

const ModalAddMember = ({ isVisible, onClose, onConfirm }) => {
	const conversationDetails = useSelector(
		(state) => state.conservation?.conversationDetails
	);
	const friends = useSelector((state) => state.user.friends);

	const [checkedFriends, setCheckedFriends] = useState([]);

	const handleCheck = (userID) => {
		const currentIndex = checkedFriends.indexOf(userID);
		const newCheckedFriends = [...checkedFriends];

		if (currentIndex === -1) {
			newCheckedFriends.push(userID);
		} else {
			newCheckedFriends.splice(currentIndex, 1);
		}

		setCheckedFriends(newCheckedFriends);
	};

	const renderFriend = ({ item }) => {
		if (
			conversationDetails.participantIds.some(
				(participant) => participant.participantId === item.user.userID
			)
		) {
			return null;
		}

		return (
			<View style={styles.item}>
				<Image
					source={{ uri: item.user.profilePic }}
					style={styles.profilePic}
				/>
				<Text style={styles.name}>{item.user.fullName}</Text>
				<CheckBox
					value={checkedFriends.includes(item.user.userID)}
					onValueChange={() => handleCheck(item.user.userID)}
				/>
			</View>
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
					data={friends}
					keyExtractor={(item) => item.user.userID.toString()}
					renderItem={renderFriend}
				/>
				<TouchableOpacity
					style={[
						styles.closeButton,
						{ backgroundColor: '#139afc', marginBottom: 10 },
					]}
					onPress={() => onConfirm(checkedFriends)}
				>
					<Text>Thêm thành viên</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.closeButton} onPress={onClose}>
					<Text>Đóng</Text>
				</TouchableOpacity>
			</View>
		</Modal>
	);
};

export default ModalAddMember;

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
});
