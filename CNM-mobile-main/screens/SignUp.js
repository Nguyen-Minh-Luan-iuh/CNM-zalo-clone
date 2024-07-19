import {
	StyleSheet,
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Dimensions,
	Image,
	Button
} from 'react-native';
import React, { useState, useRef } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useForm, Controller } from 'react-hook-form';
import Toast from 'react-native-root-toast';
import authApi from '../api/authApi';
import otpApi from '../api/otpApi';
import Modal from 'react-native-modal';
const screenWidth = Dimensions.get('window').width;

const SignUp = ({ navigation }) => {
	const { control, handleSubmit, formState: { errors }, trigger } = useForm();
	const [signupErrorMessage, setSignUpErrorMessage] = useState('');
	const [isPasswordVisible, setPasswordVisible] = useState(false);

const [isModalVisible, setModalVisible] = useState(false);
const [modalMessage, setModalMessage] = useState('');

const showToast = (message) => {
  setModalMessage(message);
  setModalVisible(true);
};

const hideModal = () => {
  setModalVisible(false);
};

	const sendVerification = async (phone, password) => {
		try {
			await otpApi.sendOTP(phone);
			showToast('Gửi OTP thành công');
			navigation.navigate('VerifierSignup', { phone, password });
		} catch (error) {
			console.error('Error sending verification:', error);
			showToast('Gửi OTP không thành công');
		}
	};

	const handleRegister = async (data) => {
		const { phone, password, fullName, dateOfBirth, gender } = data;
		console.log('phone:', phone);
		console.log('password:', password);
		console.log('fullName:', fullName);
		console.log('dateOfBirth:', dateOfBirth);
		console.log('gender:', gender);
		try {
			const formData = new FormData();
			formData.append('phoneNumber', phone);
			formData.append('password', password);
			formData.append('fullName', fullName);
			formData.append('gender', gender);
			formData.append('dateOfBirth', dateOfBirth);
			console.log(formData);

			const response = await authApi.signUpWithPhone(formData);
			sendVerification(phone, password);
		} catch (error) {
			console.error('Error logging in:', error);
			// switch (error.response.status) {
			// 	case 400:
			// 		setSignUpError(true);
			// 		setSignUpErrorMessage('Số điện thoại đã được sử dụng, vui lòng dùng số khác');
			// 		break;
			// 	case 500:
			// 		setSignUpError(true);
			// 		setSignUpErrorMessage('Đăng ký không thành công. Vui lòng thử lại.');
			// 		break;
			// 	default:
			// 		setSignUpError(true);
			// 		setSignUpErrorMessage('Đã xảy ra lỗi không xác định. Vui lòng thử lại.');
			// }
		}
	};

	return (
		<View style={styles.container}>
			<View style={{ flex: 5, margin: 10 }}>
				<View style={{ flexDirection: 'row', marginBottom: 30 }}>
					<Controller
						control={control}
						name="phone"
						defaultValue="+84"
						rules={{ required: 'Không được bỏ trống số điện thoại' }}
						render={({ field: { onChange, value } }) => (
							<TextInput
								placeholder="nhập số điện thoại"
								style={styles.input}
								value={value}
								onChangeText={onChange}
								// onFocus={() => clearErrors('phone')}
							/>
						)}
					/>
					<AntDesign name="close" size={24} color="black" style={styles.icon} />
					{errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}
				</View>

				<View style={{ flexDirection: 'row', marginBottom: 30 }}>
					<Controller
						control={control}
						name="dateOfBirth"
						render={({ field: { onChange, value } }) => (
							<TextInput
								placeholder="04/03/2000"
								style={styles.input}
								value={value}
								onChangeText={onChange}
							/>
						)}
					/>
					<AntDesign name="close" size={24} color="black" style={styles.icon} />
				</View>

				<View style={{ flexDirection: 'row', marginBottom: 30 }}>
					<Controller
						control={control}
						name="fullName"
						render={({ field: { onChange, value } }) => (
							<TextInput
								placeholder="nhập tên"
								style={styles.input}
								value={value}
								onChangeText={onChange}
							/>
						)}
					/>
					<AntDesign name="close" size={24} color="black" style={styles.icon} />
				</View>

				<View style={{ flexDirection: 'row', marginBottom: 30, alignItems: 'center' }}>
					<Controller
						control={control}
						name="password"
						defaultValue=""
						rules={{
							required: 'Không được bỏ trống mật khẩu',
							minLength: {
								value: 6,
								message: 'Mật khẩu phải tối thiểu 6 ký tự',
							},
							maxLength: {
								value: 32,
								message: 'Mật khẩu không được vượt quá 32 ký tự',
							},
							pattern: {
								value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
								message: 'Mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt',
							},
						}}
						render={({ field: { onChange, onBlur, value } }) => (
							<TextInput
								secureTextEntry={!isPasswordVisible}
								placeholder="Mật khẩu"
								style={styles.input}
								value={value}
								onChangeText={onChange}
								onBlur={() => {
									onBlur();
									trigger('password');
								}}
							/>
						)}
					/>
					<TouchableOpacity onPress={() => setPasswordVisible(!isPasswordVisible)}>
						<Text>{isPasswordVisible ? 'Hide' : 'Show'}</Text>
					</TouchableOpacity>
					{errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
				</View>

				<View style={styles.pickerContainer}>
					<Controller
						control={control}
						name="gender"
						render={({ field: { onChange, value } }) => (
							<Picker
								selectedValue={value}
								onValueChange={onChange}
								style={styles.picker}
							>
								<Picker.Item label="Chọn giới tính" value="" />
								<Picker.Item label="Nam" value="male" />
								<Picker.Item label="Nữ" value="female" />
							</Picker>
						)}
					/>
				</View>

				{signupErrorMessage && <Text style={styles.errorText}>{signupErrorMessage}</Text>}

				<View style={{ marginTop: 20 }}>
					<TouchableOpacity style={styles.button_login} onPress={handleSubmit(handleRegister)}>
						<Text style={styles.buttonText}>Đăng ký</Text>
					</TouchableOpacity>
				</View>
			</View>
			<Modal isVisible={isModalVisible} onBackdropPress={hideModal}>
    <View style={{backgroundColor: 'white', padding: 20}}>
      <Text>{modalMessage}</Text>
      <Button title="Close" onPress={hideModal} />
    </View>
  </Modal>
		</View>
	);
};

export default SignUp;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	input: {
		height: 40,
		width: 350,
		borderColor: 'gray',
		backgroundColor: 'white',
		borderWidth: 0,
		borderBottomWidth: 1,
		borderBottomColor: '#eeeeee',
		paddingBottom: 10,
	},
	icon: {
		position: 'absolute',
		right: 25,
		top: 10,
	},
	errorText: {
		color: 'red',
		marginTop: 5,
	},
	pickerContainer: {
		flexDirection: 'row',
		marginBottom: 30,
		height: 40,
		width: 350,
		borderColor: 'gray',
		backgroundColor: 'white',
		borderWidth: 0,
		borderBottomWidth: 1,
		borderBottomColor: '#eeeeee',
	},
	picker: {
		height: 30,
		width: 350,
		borderColor: 'gray',
		backgroundColor: 'white',
		borderWidth: 0,
		borderBottomWidth: 1,
		borderBottomColor: '#eeeeee',
	},
	button_login: {
		backgroundColor: '#06b2fc',
		height: 45,
		borderRadius: 10,
		width: screenWidth - 40,
	},
	buttonText: {
		color: 'white',
		textAlign: 'center',
		lineHeight: 45,
	},
});
