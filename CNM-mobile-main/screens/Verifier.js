import { StyleSheet, View, Text, TextInput, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import authApi from '../api/authApi';
import otpApi from '../api/otpApi';
import userApi from '../api/userApi';
import { Button, Dialog, Portal, PaperProvider } from 'react-native-paper';
import Modal from 'react-native-modal';
import Toast from 'react-native-root-toast';
const screenWidth = Dimensions.get('window').width;
const Verifier = ({ navigation, route }) => {
    const { verificationId, phone, password } = route.params;
    const [error, setError] = useState(null);

    const [showModalForgetPassword, setShowModalForgetPassword] =
        useState(false);
    const [phoneForget, setPhoneForget] = useState(phone);
    const [newPassword, setNewPassword] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    
    const showToast = (message) => {
      setModalMessage(message);
      setModalVisible(true);
    };
    
    const hideModal = () => {
      setModalVisible(false);
    };
    

    const handlerSentSMS = async () => {
        sendChangePasswordRequest(newPassword, phoneForget);
    };
    const showDialog = () => {
        setShowModalForgetPassword(true);
    };
    const hideDialog = () => setShowModalForgetPassword(false);
    const sendChangePasswordRequest = async (newPassword, phoneForget) => {
        console.log('newPassword:', newPassword);
        console.log('phoneN:', phoneForget);
        try {
            const res = await userApi.changePassword(newPassword, phoneForget);
            console.log("res", res);
          
            setShowModalForgetPassword(false);
            showToast('Cập nhật mật khẩu thành công');
        setTimeout(() => navigation.navigate('Login'), 1000);

    } catch (error) {
      
        console.error('Đổi mật khẩu không thành công:', error);
        setShowModalForgetPassword(false);
        showToast('Đổi mật khẩu không thành công');
    }
    };

    console.log("verificationId" + verificationId);
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const otpInputs = useRef([])

    const handleChange = (index, value) => {
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Tự động chuyển trỏ tới ô nhập liệu kế tiếp khi người dùng điền số và không phải ô cuối cùng
        if (value !== '' && index < code.length - 1) {
            otpInputs.current[index + 1].focus();
        }
        else if (value === '' && index > 0) {
            otpInputs.current[index - 1].focus();
        }
    };
    const confirmCode = async () => {
        try {
            const pin = code.join("");
            await otpApi.verifyOTP(phone, pin);
            setShowModalForgetPassword(true);
        } catch (error) {
            console.error('Error confirming code:', error);
            setError('Mã OTP không chính xác, vui lòng nhập lại');
        }
    };
    return (
        <PaperProvider>
            <View style={styles.container}>
                <View style={{ height: 50, alignItems: "center", marginTop: 30, marginBottom: 10 }}>
                    <Text style={{ color: "blue", fontSize: 20, fontWeight: "bold" }}>Nhập mã pin để xác thực</Text>
                </View>
                <View style={styles.otpContainer}>
                    {code.map((value, index) => (
                        <View style={styles.otpBox} key={index}>
                            <TextInput
                                style={styles.otpText}
                                onChangeText={(text) => handleChange(index, text)}
                                value={value}
                                maxLength={1}
                                keyboardType="numeric"
                                ref={(ref) => (otpInputs.current[index] = ref)}
                            />
                        </View>
                    ))}


                </View>
                {error && <Text style={{ color: 'red', alignItems: "center", textAlign: "center", fontSize: 14 }}>{error}</Text>}
                <View style={{ alignItems: "center", height: 50, }}>
                    <TouchableOpacity style={styles.button_verifier}
                        onPress={confirmCode}
                    >
                        <Text style={{ color: "black", fontSize: 16 }}>xác thực</Text>
                    </TouchableOpacity>
                </View>
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
                                    value={phoneForget}
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
                            <Button onPress={handlerSentSMS} textColor="black">
                                Cập nhật mật khẩu
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
                <Modal isVisible={isModalVisible} onBackdropPress={hideModal}>
    <View style={{backgroundColor: 'white', padding: 20}}>
      <Text>{modalMessage}</Text>
      <Button title="Close" onPress={hideModal} />
    </View>
  </Modal>
            </View>
        </PaperProvider>
    );
};

export default Verifier;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    otpContainer: {
        marginHorizontal: 20,
        marginBottom: 30,
        justifyContent: "space-evenly",
        alignItems: "center",
        flexDirection: "row",
        paddingTop: 20,


    },
    otpBox: {
        borderRadius: 5,
        borderColor: "#000",
        borderWidth: 0.5,
        width: '15%',
    },
    otpText: {
        fontSize: 25,
        color: "red",
        padding: 0,
        textAlign: "center",
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    button_verifier: {
        backgroundColor: '#06b2fc',
        height: 45,
        borderRadius: 10,
        width: screenWidth - 40,
        alignItems: "center",
        marginTop: 30,



    },
});
