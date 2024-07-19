import {
	StyleSheet,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import infoScreen from './profileUser_onHome/InfomationDetai';
import { Avatar, Badge, Card, Divider, Button, Dialog, Portal, PaperProvider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { readProfile, clearProfile } from '../slide/ProfileSlide';
import { SimpleLineIcons } from '@expo/vector-icons';
import { selectAuthorization } from '../slide/LoginSlide';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistor } from '../store';
import authApi from '../../api/authApi';
import userApi from '../../api/userApi';
import Toast from 'react-native-root-toast';
import Modal from 'react-native-modal';


const AccountView = () => {
	let navigation = useNavigation();
	const dispatch = useDispatch();
	const profile = useSelector((state) => state.profile);
	const authorization = useSelector(selectAuthorization);

	const [newPassword, setNewPassword] = useState('');
	const [showModalForgetPassword, setShowModalForgetPassword] =
		useState(false);
	const [userData, setUserData] = useState(null);
	const [isModalVisible, setModalVisible] = useState(false);
	const [modalMessage, setModalMessage] = useState('');

	// const [phoneForget, setPhoneForget] = useState('');
	useEffect(() => {
		const fetchInfo = async () => {
			try {
				const res = await authApi.secret();

				setUserData(res.user);
				dispatch(readProfile(res.user));
			} catch (error) {
				console.error('Error when fetching user: ', error);
			}
		};
		fetchInfo();
		const unsubscribe = navigation.addListener('focus', () => {

			fetchInfo();
		});

		return unsubscribe;
	}, [dispatch, navigation]);
	let phoneNumber = userData?.phoneNumber;
	const hideDialog = () => setShowModalForgetPassword(false);
	const showToast = (message) => {
		setModalMessage(message);
		setModalVisible(true);
	};

	const hideModal = () => {
		setModalVisible(false);
	};
	const openChangePasswordModal = () => {
		setShowModalForgetPassword(true);
	};

	const closeChangePasswordModal = () => {
		sendChangePasswordRequest(newPassword, phoneNumber);
	};
	const sendChangePasswordRequest = async (newPassword, phoneNumber) => {
		console.log('newPassword:', newPassword);
		console.log('phoneN:', phoneNumber);
		try {
			const res = await userApi.changePassword(newPassword, phoneNumber);
			console.log("res", res);

			setShowModalForgetPassword(false);
			showToast('Cập nhật mật khẩu thành công');
			console.log('Đổi mật khẩu thành công:', res);

		} catch (error) {

			console.error('Đổi mật khẩu không thành công:', error);
			setShowModalForgetPassword(false);
			showToast('Đổi mật khẩu không thành công');
		}
	};
	const logout = async () => {
		await dispatch(clearProfile());
		await AsyncStorage.clear();

		persistor.purge().then(() => {
			navigation.navigate('Welcome');
		});
	};



	return (
		<PaperProvider>
			<View style={styles.container}>
				{userData && (
					<>
						<TouchableOpacity
							onPress={() => {
								navigation.navigate('infoScreen');
							}}
						>
							<Card style={{ backgroundColor: '#FFFFFF', color: "black" }}>
								<Card.Content>
									<View
										style={{
											flexDirection: 'row',
											alignItems: 'center',
										}}
									>
										<Avatar.Image
											size={55}
											source={{ uri: userData.profilePic }}
											style={{ marginRight: 10 }}
										/>
										<View style={{ flex: 1 }}>
											<Card.Title
												title={userData.fullName}
												subtitleStyle={{ fontSize: 15 }}
												titleStyle={{ color: 'black', fontSize: "bold" }}
											/>
										</View>
									</View>
								</Card.Content>
							</Card>
						</TouchableOpacity>

					</>
				)}

				<View
					style={{
						flex: 1,
						backgroundColor: '#FFFFFF',
						justifyContent: 'center',
						paddingLeft: '5%',
					}}
				>
					<TouchableOpacity
						onPress={() => navigation.navigate('infoScreen')}
					>
						<Text
							style={{
								fontSize: 14,
								fontWeight: 'bold',
								fontFamily: 'Roboto',
							}}
						>
							Thông tin
						</Text>
					</TouchableOpacity>
				</View>

				<TouchableOpacity
					onPress={openChangePasswordModal}
					style={{
						flex: 1,
						backgroundColor: '#FFFFFF',
						justifyContent: 'center',
						paddingLeft: '5%',
					}}
				>
					<Text
						style={{
							fontSize: 14,
							fontWeight: 'bold',
							fontFamily: 'Roboto',
						}}
					>
						Đổi mật khẩu
					</Text>
				</TouchableOpacity>
				<View style={{ flex: 0.1 }}></View>
				<TouchableOpacity
					style={{
						flex: 1,
						backgroundColor: '#FFFFFF',
						justifyContent: 'center',
						paddingLeft: '5%',
					}}
				>
					<Text
						style={{
							fontSize: 14,
							fontWeight: 'bold',
							fontFamily: 'Roboto',
						}}
					>
						Cập nhật giới thiệu bản thân
					</Text>
				</TouchableOpacity>
				<View style={{ flex: 0.05 }}></View>
				<View
					style={{
						flex: 1,
						backgroundColor: '#FFFFFF',
						justifyContent: 'center',
						paddingLeft: '5%',
					}}
				>
					<Text
						style={{
							fontSize: 14,
							fontWeight: 'bold',
							fontFamily: 'Roboto',
						}}
					>
						Ví của tôi
					</Text>
				</View>
				<View style={{ flex: 0.3 }}></View>

				<View style={{ flex: 5.15, backgroundColor: '#FFFFFF' }}>
					<View style={{ flex: 2, justifyContent: 'center' }}>
						<Text
							style={{
								fontSize: 14,
								fontWeight: 'bold',
								fontFamily: 'Roboto',
								paddingLeft: '5%',
								color: 'blue',
							}}
						>
							Cài đặt
						</Text>
						<View style={{ flex: 0.3 }}></View>
						<Text
							style={{
								fontSize: 14,
								fontWeight: 'bold',
								fontFamily: 'Roboto',
								paddingLeft: '5%',
							}}
						>
							Mã QR của tôi
						</Text>
					</View>
					<View style={{ flex: 0.05, backgroundColor: '#D7D7D7' }}></View>
					<View
						style={{
							flex: 1,
							backgroundColor: '#FFFFFF',
							justifyContent: 'center',
							paddingLeft: '5%',
						}}
					>
						<Text
							style={{
								fontSize: 14,
								fontWeight: 'bold',
								fontFamily: 'Roboto',
							}}
						>
							Quyền riêng tư
						</Text>
					</View>
					<View style={{ flex: 0.05, backgroundColor: '#D7D7D7' }}></View>
					<View
						style={{
							flex: 1,
							backgroundColor: '#FFFFFF',
							justifyContent: 'center',
							paddingLeft: '5%',
						}}
					>
						<Text
							style={{
								fontSize: 14,
								fontWeight: 'bold',
								fontFamily: 'Roboto',
							}}
						>
							Quyền quản lý tài khoản
						</Text>
					</View>
					<View style={{ flex: 0.05, backgroundColor: '#D7D7D7' }}></View>
					{/* <View style={{ flex: 1, backgroundColor: "#FFFFFF", justifyContent: "center", paddingLeft: "5%", }}>
          <Text style={{ fontSize: 14, fontWeight: "bold", fontFamily: "Roboto" }}>Cài đặt chung</Text>
        </View> */}
					<TouchableOpacity onPress={logout}>
						<View
							style={{
								flex: 1,
								backgroundColor: '#FFFFFF',
								justifyContent: 'center',
								paddingLeft: '5%',
								flexDirection: 'row',
							}}
						>
							<View style={{ width: '5%' }}>
								<SimpleLineIcons
									name="logout"
									size={24}
									color="red"
								/>
							</View>
							<View style={{ width: '95%' }}>
								<Text
									style={{
										fontSize: 14,
										fontWeight: 'bold',
										fontFamily: 'Roboto',
										marginLeft: 10,
									}}
								>
									Đăng xuất
								</Text>
							</View>
						</View>
					</TouchableOpacity>
				</View>
				<View style={{ flex: 5.05, backgroundColor: '#FFFFFF' }}></View>
				<Portal>
					<Dialog
						visible={showModalForgetPassword}
						onDismiss={hideDialog}
						style={{ backgroundColor: 'white' }}
					>
						<Dialog.Title style={{ color: 'black' }}>
							Quên mật khẩu
						</Dialog.Title>
						<Dialog.Content>
							<View>
								<TextInput
									placeholder="Số điện thoại"
									defaultValue={phoneNumber}


									onChangeText={(text) =>
										setPhoneForget(text)
									}
									style={{
										borderWidth: 1,
										borderColor: 'black',
										paddingHorizontal: 10,
										paddingVertical: 5,
										borderRadius: 5,
										marginVertical: 10,
									}}
								/>
								<TextInput
									placeholder="Nhập mật khẩu mới"
									value={newPassword}
									onChangeText={(text) =>
										setNewPassword(text)
									}
									style={{
										borderWidth: 1,
										borderColor: 'black',
										paddingHorizontal: 10,
										paddingVertical: 5,
										borderRadius: 5,
									}}
								/>
							</View>
						</Dialog.Content>
						<Dialog.Actions>
							<Button onPress={hideDialog} textColor="black">
								Hủy
							</Button>
							<Button onPress={closeChangePasswordModal} textColor="black">
								Cập nhật mật khẩu
							</Button>
						</Dialog.Actions>
					</Dialog>
				</Portal>
				<Modal isVisible={isModalVisible} onBackdropPress={hideModal}>
					<View style={{ backgroundColor: 'white', padding: 20 }}>
						<Text>{modalMessage}</Text>
						<Button title="Close" onPress={hideModal} />
					</View>
				</Modal>
			</View>
		</PaperProvider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#D7D7D7',
	},
});

export default AccountView;
