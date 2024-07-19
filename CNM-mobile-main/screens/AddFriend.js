import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Modal,
	TouchableOpacity,
	Image,
	StatusBar,
	TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import userApi from '../api/userApi';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-root-toast';

// import { addFriend } from '../views/slide';
const AddFriendScreen = () => {
	const navigation = useNavigation();
	const [borderColor, setBorderColor] = useState('gray');

	const [backgroundPhone, setBackgroundPhone] = useState('#DDDDDD');
	const [phoneNumber, setPhoneNumber] = useState('+84');
	const [modalInvalidPhone, setModalInvalidPhone] = useState(false);
	const [modalPhoneNotLinked, setModalPhoneNotLinked] = useState(false);
	const dispatch = useDispatch();

	// Function to get token from AsyncStorage
	//   const getToken = async () => {
	//     try {
	//       const token = await AsyncStorage.getItem('token');
	//       return token;
	//     } catch (error) {
	//       console.error('Lỗi khi lấy dữ liệu từ AsyncStorage:', error);
	//       return null;
	//     }
	//   }
	const changeColor = () => {
		setBorderColor('#0033CC');
		setBackgroundPhone('#99CCFF');
	};
	const revertColor = () => {
		setBorderColor('gray');
		setBackgroundPhone('#DDDDDD');
	};
	const showToast = (message) => {
		Toast.show(message, {
			duration: Toast.durations.LONG,
			position: Toast.positions.BOTTOM,
			shadow: true,
			animation: true,
			hideOnPress: true,
			delay: 0,
		});
	};
	showToast('This is a message');

	const handleReqeustAddFriend = async () => {
		if (!phoneNumber || phoneNumber.length === 0) {
			window.alert('Error', 'Please enter a phone number.');
			return;
		}

		try {
			const response = await userApi.findUser(phoneNumber);
			const newSearchResult = response?.users;
			if (newSearchResult && newSearchResult.length > 0) {
				const friendId = newSearchResult[0].userID;
				// dispatch(addFriend(newSearchResult));
				// await userApi.addFriend(profile?.userID, friendId);

				// Hiển thị thông báo thành công
				navigation.navigate('FriendInfo', {
					friendId: friendId,
					friendName: newSearchResult[0].fullName,
					friendAvatar: newSearchResult[0].profilePic,
				});
			} else {
				// Hiển thị thông báo nếu không tìm thấy người dùng
				showToast('User not found!');
			}
		} catch (error) {
			console.error('Error adding friend:', error);
			// Hiển thị thông báo lỗi nếu có lỗi xảy ra
			window.alert(
				'Error',
				'An error occurred while adding friend. Please try again later.'
			);
		}
	};

	return (
		<View style={styles.container}>
			<StatusBar />
			<View
				style={{
					borderBottomColor: '#CCCCCC',
					borderBottomWidth: 1,
					width: '100%',
				}}
			/>

			<View style={{ flex: 1, backgroundColor: '#fff' }}>
				<View style={{ flex: 4, backgroundColor: 'white' }}>
					<View style={{ flex: 1 }}>
						<View
							style={{
								flexDirection: 'row',
								flex: 1,
								alignItems: 'center',
							}}
						>
							<View
								style={{
									flex: 5,
									borderWidth: 1,
									borderColor: borderColor,
									flexDirection: 'row',
									height: 30,
									marginLeft: 15,
									borderRadius: 10,
								}}
							>
								<TextInput
									style={{ flex: 2.5, marginLeft: 15 }}
									defaultValue={phoneNumber}
									placeholder="nhập số bạn bè cần tìm"
									keyboardType="numeric"
									onFocus={changeColor}
									onBlur={revertColor}
									value={phoneNumber}
									onChangeText={(text) =>
										setPhoneNumber(text)
									}
								></TextInput>
							</View>
							<TouchableOpacity
								style={{
									flexDirection: 'row',
									backgroundColor: '#DDDDDD',
									borderRadius: 50,
									width: 45,
									height: 45,
									justifyContent: 'center',
									alignItems: 'center',
									margin: 10,
									marginRight: 20,
								}}
								onPress={handleReqeustAddFriend}
							>
								<Icon
									name="arrowright"
									size={22}
									color={'black'}
								/>
							</TouchableOpacity>
						</View>
					</View>
					<View
						style={{
							borderBottomColor: '#EEEEEE',
							borderBottomWidth: 7,
							width: '100%',
						}}
					/>

					<View style={{ flex: 1 }}>
						<TouchableOpacity
							style={{
								flex: 1,
								flexDirection: 'row',
								alignItems: 'center',
								marginLeft: 5,
							}}
							onPress={() => navigation.navigate('Home')}
						>
							<Icon
								name="contacts"
								size={25}
								color={'#002c8c'}
								style={{ margin: 15 }}
							></Icon>
							<Text style={{ fontSize: 16 }}>Xem danh bạn</Text>
						</TouchableOpacity>
						<View
							style={{
								borderBottomColor: '#EEEEEE',
								borderBottomWidth: 1,
								width: '100%',
								marginLeft: 20,
							}}
						/>
						<TouchableOpacity
							style={{
								flex: 1,
								flexDirection: 'row',
								alignItems: 'center',
								marginLeft: 5,
							}}
						>
							<Image
								source={require('../images/peoplemayknow.png')}
								style={{
									width: 25,
									height: 25,
									borderRadius: 2,
									margin: 15,
								}}
							/>
							<Text style={{ fontSize: 16 }}>
								Những người bạn có thể biết
							</Text>
						</TouchableOpacity>
					</View>
				</View>
				<View
					style={{
						backgroundColor: '#EEEEEE',
						alignItems: 'center',
						flex: 2.3,
					}}
				>
					<Text style={{ color: '#999', marginTop: 20 }}>
						View sent friend requests in Contacts
					</Text>
				</View>
			</View>

			<Modal
				animationType="slide"
				transparent={true}
				visible={modalInvalidPhone}
			>
				<View
					style={{
						height: '100%',
						width: '100%',
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: 'rgba(0, 0, 0, 0.5)',
					}}
				>
					<View
						style={{
							height: '25%',
							width: '90%',
							backgroundColor: 'white',
							padding: 10,
						}}
					>
						<Text
							style={{
								fontSize: 20,
								alignSelf: 'flex-start',
								fontWeight: '600',
								margin: 10,
							}}
						>
							Notification
						</Text>
						<View
							style={{
								borderBottomColor: '#EEEEEE',
								borderBottomWidth: 0.2,
								width: '100%',
							}}
						/>
						<Text
							style={{
								fontSize: 14,
								color: '#555555',
								alignSelf: 'flex-start',
							}}
						>
							The phone number is invalid. Please check again
						</Text>
						<View
							style={{
								justifyContent: 'flex-end',
								alignItems: 'flex-end',
								marginTop: '18%',
							}}
						>
							<TouchableOpacity
								// onPress={() => setModalInvalidPhone(false)}
								style={{
									height: 50,
									width: 100,
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<Text
									style={{
										fontSize: 15,
										alignSelf: 'center',
										textAlign: 'center',
										fontWeight: '600',
									}}
								>
									CLOSE
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			<Modal
				animationType="slide"
				transparent={true}
				visible={modalPhoneNotLinked}
			>
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<View
						style={{
							backgroundColor: '#222222',
							padding: 20,
							borderRadius: 10,
						}}
					>
						<Text style={{ fontSize: 16, color: 'white' }}>
							This phone number has not been linked to{'\n'} an
							account or does not allow searching
						</Text>
					</View>
				</View>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default AddFriendScreen;
