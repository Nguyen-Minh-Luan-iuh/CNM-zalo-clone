import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import styled from 'styled-components';
import { format } from 'date-fns';
import authApi from '../api/authApi';
import otpApi from '../api/otpApi';
import { BsFillShieldLockFill } from 'react-icons/bs';
import OtpInput from 'otp-input-react';
import { CgSpinner } from 'react-icons/cg';
import { toast, Toaster } from "react-hot-toast";
import DatePicker from "react-datepicker";
import configs from '../configs';
import { AuthToken } from '../context/AuthToken';
import "react-datepicker/dist/react-datepicker.css";

const WrapperStyled = styled.div`
	width: 100vw;
	height: 100vh;
	padding: 2rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: var(--color-60);
`;

const LogoStyled = styled.h1`
	color: #0068ff;
	font-size: 3.5rem;
	margin-bottom: 0.4rem;
`;
const ParagraphStyled = styled.p`
	width: 20rem;
	text-align: center;
	margin-bottom: 0;

	font-size: 1.125rem;
	color: #333;
`;

const WrapperStyledOTP = styled.div`
	width: 25rem;
	height: auto;
	background-color: #fff;
	margin-top: 1rem;

	display: flex;
	flex-direction: column;
	align-items: center;

	padding: 2rem;
	border-radius: 0.125rem;
`;
const FormStyled = styled.form`
	width: 25rem;
	height: auto;
	background-color: white;
	box-shadow: 0 8px 24px rgba(21,48,142,0.14);
	display: flex;
	flex-direction: column;
	align-items: center;

	padding: 1.4rem 2rem;
	margin-top: 1rem;
	border-radius: 0.125rem;
`;
const InputWrapper = styled.div`
	margin-bottom: 0.8rem;
	width: 100%;
	font-size: 0.9rem;

	.react-datepicker-wrapper {
		width: 100%
	}
`;
const InputStyled = styled.input`
	border: none;
	border-bottom: 1px solid #ccc;
	outline: none;
	padding: 5px 0;
	font-size: 1rem;
	width: 100%;
`;
const LabelStyled = styled.label`
	font-size: 1rem;
`;
const PhoneInputStyled = styled(PhoneInput)`
	& > * {
		border: none;
		border-bottom: 1px solid #ccc;
		outline: none;
		padding: 5px 0;
		font-size: 1rem;
	}
`;
const DatePickerStyled = styled(DatePicker)`
	width: 100%;
	border: none;
	border-bottom: 1px solid #ccc;
	outline: none;
	padding: 5px 0;
	font-size: 1rem;
	width: 100%;
`;
const ErrorMessage = styled.span`
	color: red;
	margin: 0.5rem 0;
`;
const ButtonStyled = styled.button`
	user-select: none;
	width: 100%;
	padding: 1rem;
	border-radius: 0.25rem;
	border: none;
	margin-top: 0.8rem;

	cursor: pointer;

	color: white;
	font-size: 0.875rem;
	background-color: #0190f3;

	&:hover {
		opacity: 0.9;
	}
	&:active {
		opacity: 1;
	}
	&.disabled {
		cursor: no-drop;
		opacity: 0.4;
	}
`;

const DivPhoneFill = styled.div`
	background-color: rgb(92 212 127) !important;
	color: white;

	margin-left: auto;
	margin-right: auto;
	gap: 1rem;
	border-radius: 9999px;
	width: fit-content;
	padding: 1rem;
`;

const LabelPhoneFill = styled.label`
	width: 100%;
	font-weight: bold; /* Makes the text bold */
	font-size: 1.25rem; /* Sets the font size to XL (assuming 1rem base size) */
	color: gray; /* Sets the text color to gray */
	text-align: center; /* Aligns the text to the center */
	margin-bottom: 2rem; /* Adds 10px margin at the bottom */
	margin-top: 1px; /* Adds 1px margin at the top */
`;

const ButtonStyledSubscription = styled.button`
	user-select: none;
	width: 100%;
	padding: 1rem;
	border-radius: 0.25rem;
	margin-top: 1rem;
	background-color: white;
	cursor: pointer;
	color: #0190f3;
	font-size: 0.875rem;
	border: 1px solid var(--border);

	&:hover {
		border: 1px solid #0184e0;
	}
	&:active {
		opacity: 1;
	}
	&.disabled {
		cursor: no-drop;
		opacity: 0.4;
	}
`;
const Register = () => {
	const {
		control,
		handleSubmit,
		register,
		formState: { errors }, reset
	} = useForm({
		shouldFocusError: false, // Ngăn không cho focus vào trường bị lỗi
	});
	const navigate = useNavigate();
	const { login } = useContext(AuthToken);
	const [isLoading, setIsLoading] = useState(false);
	const [otp, setOtp] = useState(""); // State để lưu giá trị của OTP
	const [showOTP, setShowOTP] = useState(false); // State để điều khiển hiển thị/ẩn OTP
	const [phoneNumber, setPhoneNumber] = useState('')
	const [showRegisterForm, setShowRegisterForm] = useState(false);
	const [showVerifyPhoneNumberForm, setShowVerifyPhoneNumberForm] = useState(true);

	const handleShowLoginPage = () => {
		navigate(configs.routes.login);
	};

	const handleShowHomePage = () => {
		navigate(configs.routes.home);
	};

	const handleSignUp = async (formData) => {
		try {
			const formattedDOB = format(formData.dateOfBirth, 'dd/MM/yyyy');
			const data = {
				phoneNumber,
				password: formData.password,
				fullName: formData.fullName,
				dateOfBirth: formattedDOB,
				gender: formData.gender
			}
			setIsLoading(true);
			await authApi.signUpWithPhone(data);
			setIsLoading(false);
			// Hiển thị Toast khi đăng kí thành công
			toast.success("Đăng kí thành công");
			reset();

			// Làm ra 1 hàng chờ 2s rồi chuyển hướng về trang login
			setTimeout(async () => {
				await login(data);
				handleShowHomePage()
			}, 1500)
		} catch (error) {
			console.error('Error while signing up:', error);
			if(error?.response && error?.response.data && error?.response.data.message){
				toast.error(error.response.data.message)
			}
		} finally {
			setIsLoading(false);
		}
	};

	const onOTPVerify = async () => {
		try {			
			setIsLoading(true);		
			await otpApi.verifyOTP(phoneNumber, otp)
			setIsLoading(false);
			toast.success("Xác thực OTP thành công")
			setTimeout(() => {
				setShowOTP(false)
				setShowRegisterForm(true)
			}, 1500)
		} catch (error) {
			setIsLoading(false);
			console.log(error)
			if(error?.response && error?.response.data && error?.response.data.message){
				toast.error(error.response.data.message)
			}
		}
	}

	const sendOTP = async (formData) => {
		try {	
			setIsLoading(true);	
			setPhoneNumber(formData["phoneNumber"])
			await otpApi.sendOTP(formData["phoneNumber"]);
			setIsLoading(false);
			setShowVerifyPhoneNumberForm(false)
			setShowOTP(true);
		} catch (error) {
			setIsLoading(false);
			console.log(error);
			toast.error("Gửi OTP không thành công")
		}
	}

	return (
		<WrapperStyled>
			<LogoStyled>Zalo</LogoStyled>
			<ParagraphStyled>Đăng nhập tài khoản Zalo</ParagraphStyled>
			<ParagraphStyled className='mb-4'>để kết nối với ứng dụng Zalo Web</ParagraphStyled>
			<Toaster toastOptions={{ duration: 1500 }} />
			{showVerifyPhoneNumberForm && (
				<section className="flex items-center justify-center h-screen">
					<div>
						<FormStyled onSubmit={handleSubmit(sendOTP)} enctype="multipart/form-data">
							<InputWrapper>
								<Controller
									name="phoneNumber"
									control={control}
									defaultValue=""
									rules={{
										required: 'Không được bỏ trống số điện thoại',
									}}
									render={({ field }) => (
										<PhoneInputStyled
											placeholder="Số điện thoại"
											value={field.value}
											onChange={field.onChange}
										/>
									)}
								/>
								{errors.phoneNumber && (
									<ErrorMessage>
										{errors.phoneNumber.message}
									</ErrorMessage>
								)}
							</InputWrapper>

							<ButtonStyled type="submit" >Xác thực số điện thoại</ButtonStyled>

							<ButtonStyledSubscription type="button" onClick={handleShowLoginPage}>Đăng nhập</ButtonStyledSubscription>
						</FormStyled>
					</div>

				</section>
			)}
			{showOTP && (
				<WrapperStyledOTP>
					<DivPhoneFill>
						<BsFillShieldLockFill size={30} />
					</DivPhoneFill>
					<LabelPhoneFill
						htmlFor="otp"
					>
						Nhập mã OTP
					</LabelPhoneFill>
					<OtpInput
						value={otp}
						onChange={setOtp}
						OTPLength={6}
						otpType="number"
						disabled={false}
						autoFocus
						style={{ marginBottom: '1.5rem', marginLeft: '1.25rem' }}
					>
					</OtpInput>
					<ButtonStyled
						type="button"
						onClick={onOTPVerify}
						className="btn-bg text-white rounded ">
						{isLoading && <CgSpinner size={20} className="mt-1 animate-spin" />}
						<span>Xác nhận OTP</span>
					</ButtonStyled>
				</WrapperStyledOTP>
			)}
			{showRegisterForm && (
				<section className="flex items-center justify-center h-screen">
					<div>
						{/* <Toaster toastOptions={{ duration: 1500 }} /> */}
						<FormStyled onSubmit={handleSubmit(handleSignUp)} enctype="multipart/form-data">
							<InputWrapper>
								<Controller
									name="fullName"
									control={control}
									defaultValue=""
									rules={{
										required: 'Không được bỏ trống full name',

									}}
									render={({ field }) => (
										<InputStyled
											type="text"
											placeholder="Họ tên"
											{...field}
										/>
									)}
								/>
								{errors.fullName && (
									<ErrorMessage>{errors.fullName.message}</ErrorMessage>
								)}
							</InputWrapper>

							<InputWrapper>
								<Controller
									name="password"
									control={control}
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
									render={({ field }) => (
										<InputStyled
											type="password"
											placeholder="Mật khẩu"
											{...field}
										/>
									)}
								/>
								{errors.password && (
									<ErrorMessage>{errors.password.message}</ErrorMessage>
								)}
							</InputWrapper>

							<InputWrapper>
								{/* <label className='d-block' htmlFor="dateOfBirth">Ngày sinh:</label> */}
								<Controller
									name="dateOfBirth"
									control={control}
									defaultValue={null}
									rules={{
										required: 'Vui lòng chọn ngày sinh',
									}}
									render={({ field }) => (
										<DatePickerStyled
											selected={field.value}
											onChange={(date) => field.onChange(date)}
											dateFormat="dd/MM/yyyy"
											showYearDropdown
											scrollableYearDropdown
											yearDropdownItemNumber={15}
											placeholderText="Chọn ngày sinh"
											maxDate={new Date()} // Ngày hiện tại là ngày tối đa
											{...field}
										/>
									)}
								/>
								{errors.dateOfBirth && (
									<ErrorMessage>{errors.dateOfBirth.message}</ErrorMessage>
								)}
							</InputWrapper>

							{/* Tạo ra phần select chọn giới tính */}
							<InputWrapper>
								<LabelStyled className='d-block mt-3 mb-2' htmlFor="gender">Giới tính: </LabelStyled>
								<div className='d-flex align-items-center'>
									<input
										type="radio"
										id="male"
										name="gender"
										value="male"
										{...register("gender", { required: "Vui lòng chọn giới tính" })}
									/>
									<LabelStyled className='mx-2' htmlFor="male">Nam</LabelStyled>

									<input
										className='mx-2'
										type="radio"
										id="female"
										name="gender"
										value="female"
										{...register("gender", { required: "Vui lòng chọn giới tính" })}
									/>
									<LabelStyled htmlFor="female">Nữ</LabelStyled>
								</div>

								{errors.gender && (
									<ErrorMessage>{errors.gender.message}</ErrorMessage>
								)}
							</InputWrapper>

							<ButtonStyled type="submit" >Đăng ký</ButtonStyled>

							<ButtonStyledSubscription type="button" onClick={handleShowLoginPage}>Đăng nhập</ButtonStyledSubscription>
						</FormStyled>
					</div>

				</section>
			)}
		</WrapperStyled>
	);
};

export default Register;
