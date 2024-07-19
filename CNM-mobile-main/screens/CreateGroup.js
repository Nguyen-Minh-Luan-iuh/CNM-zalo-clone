import React, { useState } from 'react';
import {
	View,
	Text,
	TextInput,
	Button,
	FlatList,
	StyleSheet,
	Image,
	CheckBox,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import conversationApi from '../api/conversationApi';
import Modal from 'react-native-modal';
import { setConversationDetails } from '../views/slide/ConsevationSlide';
import { useNavigation } from '@react-navigation/native';

const CreateGroup = () => {
	const navigation = useNavigation();
	const dispatch = useDispatch();
	const friends = useSelector((state) => state.user.friends);
	const profile = useSelector((state) => state.profile.profile);
	const [groupName, setGroupName] = useState('');
	const [imageUri, setImageUri] = useState(null);
	const [checkedFriends, setCheckedFriends] = useState([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [modalMessage, setModalMessage] = useState('');

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
			base64: true,
		});
		if (!result.canceled) {
			setImageUri(result.assets[0].uri);
		}
	};

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

	const showModal = (message) => {
		setModalMessage(message);
		setModalVisible(true);
	};

	const handlerCreateGroup = async () => {
		if (!groupName.trim()) {
			showModal('Vui lòng nhập tên nhóm');
			return;
		}
		if (!imageUri) {
			showModal('Vui lòng chọn ảnh đại diện');
			return;
		}
		if (checkedFriends.length < 2) {
			showModal('Số thành viên tối thiểu phải là 3 người');
			return;
		}

		try {
			const response = await fetch(imageUri);
			const blob = await response.blob();
			const res = await conversationApi.createConversation({
				participantIds: [...checkedFriends, profile.userID],
				name: groupName,
				avatar: blob,
			});
			if (res) {
				dispatch(setConversationDetails(res.conversation));
				navigation.navigate('ChatDetail');
			}
		} catch (error) {
			showModal('Tạo nhóm không thành công');
			console.error('error', error);
		}
	};
	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerText}>Tạo Nhóm Mới</Text>
				<Button title="Tạo nhóm" onPress={handlerCreateGroup} />
			</View>
			<View style={styles.inputGroup}>
				<Button title="Chọn Ảnh Đại Diện" onPress={pickImage} />
				{imageUri && (
					<View style={styles.imagePreview}>
						<Image
							source={{ uri: imageUri }}
							style={styles.previewImage}
						/>
					</View>
				)}
				<TextInput
					style={styles.input}
					placeholder="Nhập tên nhóm"
					value={groupName}
					onChangeText={setGroupName}
				/>
			</View>
			<FlatList
				data={friends}
				keyExtractor={(item) => item.user.userID}
				renderItem={({ item }) => (
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
				)}
			/>
			<Modal
				animationType="slide"
				// transparent={true}
				isVisible={modalVisible}
				onBackdropPress={() => setModalVisible(false)}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
				}}
			>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<Text style={styles.modalText}>{modalMessage}</Text>
						<Button
							title="Close"
							onPress={() => setModalVisible(!modalVisible)}
						/>
					</View>
				</View>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	header: {
		marginBottom: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	headerText: {
		fontSize: 24,
		fontWeight: 'bold',
	},
	inputGroup: {
		marginBottom: 20,
	},
	input: {
		marginBottom: 10,
		borderWidth: 1,
		borderColor: '#ddd',
		padding: 10,
		borderRadius: 5,
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
	imagePreview: {
		alignItems: 'center',
		justifyContent: 'center',
		marginVertical: 10,
	},
	previewImage: {
		width: 200,
		height: 200,
		borderRadius: 10,
	},
});

export default CreateGroup;
