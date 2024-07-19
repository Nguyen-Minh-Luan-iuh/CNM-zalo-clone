import React, { useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	Button,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import {
	readProfile,
	updateProfileStart,
	updateProfileSuccess,
	updateProfileFailure,
} from '../../slide/ProfileSlide';
import * as ImagePicker from 'expo-image-picker';
import userApi from '../../../api/userApi';

export default function InformationDetail() {
	const dispatch = useDispatch();
	let navigation = useNavigation();
	const profile = useSelector(state => state.profile.profile);
	const loading = useSelector(state => state.profile.loading);
	const [isModalVisible, setModalVisible] = useState(false);
	const [updatedImageUrl, setUpdatedImageUrl] = useState(profile.profilePic);

	const handleImagePickerPress = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (!result.canceled) {
			uploadProfilePic(result.assets[0].uri);
		}
	};

	const uploadProfilePic = async (file) => {
		dispatch(updateProfileStart());
		try {
			const response = await fetch(file);
			const blob = await response.blob();
			const res = await userApi.updateAvatar(blob);

			if (res) {
				dispatch(readProfile(res.updatedUser[0]));
				setUpdatedImageUrl(res.updatedUser[0].profilePic);
				navigation.goBack();
			}
		} catch (error) {
			dispatch(updateProfileFailure('Error updating profile picture'));
			console.error('Error during image upload:', error);
		} finally {
			setModalVisible(false);
		}
	};

	const openModal = () => {
		setModalVisible(true);
	};

	return (
		<View style={styles.container}>
			<View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#247bfe' }}>
				<AntDesign
					name="arrowleft"
					size={24}
					color="white"
					style={{ flex: 1, paddingLeft: '5%' }}
					onPress={() => navigation.goBack()}
				/>
			</View>
			<View style={{ flex: 3 }}>
				<Button
					style={{ flex: 1, position: 'absolute', top: '61%' }}
					title="Change Avatar"
					onPress={openModal}
				/>
				<Image
					source={{ uri: updatedImageUrl }}
					style={{ width: '100%', height: '100%' }}
				/>
				<TouchableOpacity onPress={openModal}>
					<View style={{ flex: 3, position: 'absolute', top: '61%', width: '50%', paddingLeft: '5%' }}>
						<Image
							style={{ width: 60, height: 60, borderRadius: 50, resizeMode: 'contain' }}
							source={{ uri: updatedImageUrl }}
						/>
					</View>
				</TouchableOpacity>

				<Text style={{ position: 'absolute', top: '70%', fontFamily: 'Roboto', fontSize: 20, fontWeight: 'bold', color: 'white', paddingLeft: '25%' }}>
					{profile.fullName}
				</Text>
			</View>
			<View style={{ flex: 3, backgroundColor: '#fff' }}>
				<Text style={{ fontFamily: 'Roboto', fontSize: 18, fontWeight: 'bold', paddingLeft: '5%', paddingTop: '3%' }}>
					Thông tin cá nhân
				</Text>
				<View style={{ flex: 1, flexDirection: 'row', paddingLeft: '5%', alignItems: 'center' }}>
					<Text style={{ fontFamily: 'Roboto', fontSize: 15 }}>Giới tính</Text>
					<View style={{ flex: 0.2 }}></View>
					<Text style={{ fontFamily: 'Roboto', fontSize: 15 }}>{profile.gender}</Text>
				</View>
				<View style={{ flex: 0.02, backgroundColor: '#CCCCCC', paddingLeft: '5%' }}></View>
				<View style={{ flex: 1, flexDirection: 'row', paddingLeft: '5%', alignItems: 'center' }}>
					<Text style={{ fontFamily: 'Roboto', fontSize: 15 }}>Ngày sinh</Text>
					<View style={{ flex: 0.2 }}></View>
					<Text style={{ fontFamily: 'Roboto', fontSize: 15 }}>30/04/2002</Text>
				</View>
				<View style={{ flex: 0.02, backgroundColor: '#CCCCCC', paddingLeft: '5%' }}></View>
				<View style={{ flex: 1, flexDirection: 'row', paddingLeft: '5%', paddingTop: '3%' }}>
					<Text style={{ fontFamily: 'Roboto', fontSize: 15 }}>Điện thoại</Text>
					<View style={{ flex: 0.2 }}></View>
					<View style={{ flex: 1, flexDirection: 'column' }}>
						<Text style={{ fontFamily: 'Roboto', fontSize: 15 }}>{profile.phoneNumber}</Text>
						<Text style={{ fontFamily: 'Roboto', fontSize: 12 }}>
							Số điện thoại chỉ hiện thị với người có lưu só bạn trong danh bạ máy
						</Text>
					</View>
				</View>
			</View>
			<View style={{ flex: 3 }}></View>

			{/* Modal */}
			<Modal isVisible={isModalVisible}>
				<View style={{ flex: 1 }}>
					<Text>Select a new profile picture</Text>
					<Button title="Select Image" onPress={handleImagePickerPress} />
					<Button title="Close" onPress={() => setModalVisible(false)} />
				</View>
			</Modal>

			{/* Loading Indicator */}
			{loading && (
				<View style={styles.loading}>
					<ActivityIndicator size="large" color="#247bfe" />
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#CCCCCC',
	},
	loading: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0,0,0,0.5)',
	},
});
