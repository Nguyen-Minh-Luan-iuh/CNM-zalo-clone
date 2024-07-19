import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link  } from 'react-router-dom';
import { useForm, Controller, useWatch } from 'react-hook-form';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import styled from 'styled-components';

import { BsFillShieldLockFill, BsTelephoneFill } from 'react-icons/bs';
import { MdLockReset } from "react-icons/md";
import OtpInput from 'otp-input-react';
import { CgSpinner } from 'react-icons/cg';
import { toast, Toaster } from "react-hot-toast";
import userApi from '../api/userApi';
import "react-datepicker/dist/react-datepicker.css";

import { AuthToken } from '../context/AuthToken';
import configs from '../configs';
import otpApi from '../api/otpApi';


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
const FormStyled = styled.form`
		width: 25rem;
		height: auto;
		background-color: white;
		box-shadow: 0 8px 24px rgba(21,48,142,0.14);
		display: flex;
		flex-direction: column;
		align-items: center;

		padding: 2rem;
		margin-top: 1rem;
		border-radius: 0.125rem;
	`;
const InputWrapper = styled.div`
		margin-bottom: 0.8rem;
		width: 100%;
		font-size: 0.9rem;
	`;
const InputStyled = styled.input`
		border: none;
		border-bottom: 1px solid #ccc;
		outline: none;
		padding: 5px 0;
		font-size: 1rem;
		width: 100%;
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

const DivRestPassword = styled.div`
	background-color: rgb(92 212 127) !important;
	color: white;

	margin-left: auto;
	margin-right: auto;
	gap: 1rem;
	border-radius: 9999px;
	width: fit-content;
	padding: 1rem;
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

const ModalStyled = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	display: flex;
	justify-content: center;
`;

const ModalContent = styled.div`
	background-color: #fff;
	padding: 2rem;
	border-radius: 0.25rem;
	width: 25rem;
	margin-top: 12.5rem;
	height: fit-content;
	`;
const WrapperStyledForgotPass = styled.div`
	background-color: #fff;
`;
const Login = () => {
	const navigate = useNavigate();
	const { login } = useContext(AuthToken);
	const {
		control,
		handleSubmit,
		formState: { errors }
	} = useForm();
	const [errorMessage, setErrorMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [showModal, setShowModal] = useState(false); // State để điều khiển hiển thị/ẩn modal
	const [otp, setOtp] = useState(""); // State để lưu giá trị của OTP
	const [ph, setPh] = useState("");
	const [showOTP, setShowOTP] = useState(false); // State để điều khiển hiển thị/ẩn OTP
	const [showChangePasswordForm, setShowChangePasswordForm] = useState(false)
	const [newPassword, setNewPassword] = useState("");
	const [reNewPassword, setReNewPassword] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const phoneNumber = useWatch({
        control,
        name: 'phoneNumber',
        defaultValue: '', 
    });

	useEffect(() => {
		setPh(phoneNumber)
    }, [phoneNumber]);

	const handleShowRegisterPage = () => {
		navigate(configs.routes.register);

	};

	const handleNewPasswordChange = (e) => {
		setNewPassword(e.target.value);
	};

	const handleReNewPasswordChange = (e) => {
		setReNewPassword(e.target.value);
	};

	const handleSubmitPassword = async () => {
		try {
			// Kiểm tra mật khẩu mới và mật khẩu mới nhập lại có đủ tối thiểu 6 ký tự không
			if (newPassword.length < 6) {
				setPasswordError("Mật khẩu mới phải có ít nhất 6 ký tự");
				return;
			}
			if (newPassword.length > 32) {
				setPasswordError("Mật khẩu mới không được vượt quá 32 ký tự");
				return;
			}
			// Regex kiểm tra mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt
			const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
			if (!passwordRegex.test(newPassword)) {
				setPasswordError("Mật khẩu mới phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt");
				return;
			}
			setPasswordError(null);
	
			if (newPassword !== reNewPassword) {
				setPasswordError("Mật khẩu nhập lại không khớp");
				return;
			}
			setPasswordError(null);
	
			await userApi.changePassword(newPassword, ph);
	
			toast.success("Đổi mật khẩu thành công");
			setTimeout(() => {
				closeModal()
			}, 1500);
		} catch (error) {
			console.log(error)
		}
	};

	const sendOTP = async () => {
		try {	
			setIsLoading(true);	
			await otpApi.sendOTP(ph);
			setIsLoading(false);
			toast.success("OTP đã được gửi thành công");
			setShowOTP(true);
			setTimeout(async () => {
				setShowOTP(true);
			}, 1500)
		} catch (error) {
			setIsLoading(false);
			console.log(error);
			toast.error("Gửi OTP không thành công")
		}
	}

	const onOTPVerify = async () => {
		try {	
			setIsLoading(true);		
			await otpApi.verifyOTP(ph, otp)
			setIsLoading(false);
			toast.success("Xác thực OTP thành công")
			setTimeout(() => {
				setShowOTP(false)
				setOtp("")
				setShowChangePasswordForm(true)
			}, 1500)		
		} catch (error) {
			setIsLoading(false);
			console.log(error)
			if(error?.response && error?.response.data && error?.response.data.message){
				toast.error(error.response.data.message)
			}
		}
	}

	const onSubmit = async (data) => {
		if (Object.keys(errors).length === 0) {
			try {
				setIsLoading(true);
				const res = await login(data);
				if (res.status === 200) {
					navigate(configs.routes.home);
				}
			} catch (error) {
				if (error?.response && error?.response.status === 401) {
					setErrorMessage('Tài khoản hoặc mật khẩu không hợp lệ');
				}
			} finally {
				setIsLoading(false);
			}
		}
	};

	const openModal = () => {
		setShowModal(true);
	};

	const closeModal = () => {
		setShowChangePasswordForm(false)
		setShowOTP(false)
		setShowModal(false);
		setNewPassword("")
		setReNewPassword("")
	};

	return (
		<WrapperStyled>
			<LogoStyled>Zalo</LogoStyled>
			<ParagraphStyled>Đăng nhập tài khoản Zalo</ParagraphStyled>
			<ParagraphStyled className='mb-4'>để kết nối với ứng dụng Zalo Web</ParagraphStyled>
			<FormStyled onSubmit={handleSubmit(onSubmit)}>
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
				{isLoading ? (
					<ButtonStyled disabled className="disabled">
						Đang đăng nhập...
					</ButtonStyled>
				) : (
					<ButtonStyled type="submit">
						Đăng nhập với mật khẩu
					</ButtonStyled>
				)}
				{isLoading ? (
					<ButtonStyledSubscription disabled className="disabled">
						Đang đăng tạo tài khoản...
					</ButtonStyledSubscription>
				) : (
					<ButtonStyledSubscription type="button" onClick={handleShowRegisterPage}>
						Tạo tài khoản mới
					</ButtonStyledSubscription>
				)}
				<ErrorMessage>{errorMessage}</ErrorMessage>

				{/* Thêm sự kiện để mở modal */}
				<Link onClick={openModal} style={{ fontSize: '0.8rem' }}>Quên mật khẩu ?</Link>
			</FormStyled>
			{
				showModal && (
					<ModalStyled>
						<ModalContent>
							<section className="flex items-center justify-center h-screen">
								<div>
									<Toaster toastOptions={{ duration: 1500 }} />
									<div id="recaptcha-container"></div>
									{showChangePasswordForm ? (
										<WrapperStyledForgotPass>
											{/* Thêm icon reset password */}
											<DivRestPassword>
												<MdLockReset size={30} />
											</DivRestPassword>

											<InputWrapper>
												<LabelPhoneFill>Đổi mật khẩu cho tài khoản</LabelPhoneFill>
												<p>{ph}</p>
											</InputWrapper>

											<InputWrapper>
												<InputStyled
													type="password"
													placeholder="Nhập mật khẩu mới"
													value={newPassword}
													onChange={handleNewPasswordChange}
												/>
											</InputWrapper>
											<InputWrapper>
												<InputStyled
													type="password"
													placeholder="Nhập lại mật khẩu mới"
													value={reNewPassword}
													onChange={handleReNewPasswordChange}
												/>
												{passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
											</InputWrapper>
											<ButtonStyled type="button" onClick={handleSubmitPassword}>Xác nhận</ButtonStyled>
											<ButtonStyledSubscription type="button" onClick={closeModal}>Hủy</ButtonStyledSubscription>
										</WrapperStyledForgotPass>
									) : (
										<div>
											{showOTP ? (
												<>
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
														className="justify-content-center ps-3 pb-3"
													>
													</OtpInput>
													<ButtonStyled
														type="button"
														onClick={onOTPVerify}
														style={{ marginTop: "1rem" }}
													>
														{isLoading && <CgSpinner size={20} className="mt-1 animate-spin" />}
														<span>Xác nhận OTP</span>
													</ButtonStyled>
												</>
											) : (
												<>
													<DivPhoneFill >
														<BsTelephoneFill size={30} />
													</DivPhoneFill>
													{/* đỏi */}
													<LabelPhoneFill
														htmlFor=""
													>
														Nhập số điện thoại của bạn
													</LabelPhoneFill>

													<PhoneInputStyled className="mb-4" country={"in"} value={ph} onChange={setPh} />
													<ButtonStyled
														type="button"
														onClick={sendOTP}
														style={{ marginTop: "1rem" }}

													>
														{isLoading && (
															<CgSpinner size={20} className="mt-1 animate-spin" />
														)}
														<span>Gửi mã code via SMS</span>

													</ButtonStyled>
													<ButtonStyledSubscription type="button" onClick={closeModal}>Hủy</ButtonStyledSubscription>
												</>
											)
											}
										</div>
									)}
								</div>
							</section>
						</ModalContent>
					</ModalStyled>
				)
			}
		</WrapperStyled >
	);
};

export default Login;
