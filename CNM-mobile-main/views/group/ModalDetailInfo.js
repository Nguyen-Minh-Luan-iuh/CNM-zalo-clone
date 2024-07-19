import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import userApi from '../../api/userApi';

const ModalDetailInfo = ({ isVisible, onClose, infoMember }) => {
	const [detailInfo, setDetailInfo] = useState(null);

	useEffect(() => {
		const fetchDetail = async () => {
			if (infoMember) {
				const res = await userApi.findUserById(infoMember.userID);
				if (res && res.user) {
					setDetailInfo(res.user);
				}
			}
		};
		fetchDetail();
	}, [infoMember]);

	return (
		<Modal
			isVisible={isVisible}
			onBackdropPress={onClose}
			onRequestClose={onClose}
		>
			{infoMember ? (
				<View style={styles.modalView}>
					{detailInfo?.profilePic && (
						<Image
							source={{ uri: detailInfo?.profilePic }}
							style={styles.avatar}
						/>
					)}
					<Text style={styles.fullName}>{detailInfo?.fullName}</Text>
					<Text style={styles.textLabel}>
						Giới tính: {detailInfo?.gender}
					</Text>
					<Text style={styles.textLabel}>
						Ngày sinh: {detailInfo?.dateOfBirth}
					</Text>
					<TouchableOpacity
						style={styles.closeButton}
						onPress={onClose}
					>
						<Text style={styles.closeButtonText}>Đóng</Text>
					</TouchableOpacity>
				</View>
			) : (
				<Text>Loading</Text>
			)}
		</Modal>
	);
};

export default ModalDetailInfo;

const styles = StyleSheet.create({
	modalView: {
		marginTop: 50,
		backgroundColor: 'white',
		padding: 20,
		borderRadius: 10,
		alignItems: 'center',
	},
	avatar: {
		width: 100,
		height: 100,
		borderRadius: 50,
		marginBottom: 20,
	},
	fullName: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	textLabel: {
		fontSize: 16,
		marginBottom: 5,
	},
	closeButton: {
		marginTop: 20,
		backgroundColor: '#ddd',
		padding: 10,
		borderRadius: 5,
	},
	closeButtonText: {
		color: 'black',
		fontWeight: 'bold',
	},
});
