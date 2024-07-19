import { View, TextInput, TouchableOpacity, Image, Text } from 'react-native';
import React, { useState } from 'react';
import EmojiSelector from 'react-native-emoji-selector';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useDispatch, useSelector } from 'react-redux';
import messageApi from '../../../api/messageApi';
import { addMessage } from '../../slide/MessageSlide';
import * as ImagePicker from 'expo-image-picker';
import Modal from 'react-native-modal';
// import * as DocumentPicker from 'react-native-document-picker';

const ChatInput = () => {
	const [message, setMessage] = useState('');
	const [imageUri, setImageUri] = useState(null);
	const [fileUri, setFileUri] = useState(null);
	const [selectedFileName, setSelectedFileName] = useState(null);
	const [showEmojiSelector, setShowEmojiSelector] = useState(false);
	const dispatch = useDispatch();

	const conversationDetails = useSelector(
		(state) => state.conservation.conversationDetails
	);
	const profile = useSelector((state) => state.profile.profile);

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
	const pickFile = async () => {
		try {
			const file = await DocumentPicker.getDocumentAsync();
			if (file.assets && file.assets.length > 0) {
				const selectedFile = {
					uri: file.assets[0].uri,
					name: file.assets[0].name,
				};
				const fileUrl = selectedFile.uri;
				const fileName = selectedFile.name;
				setFileUri(fileUrl);
				setSelectedFileName(fileName);
			}
		} catch (error) {
			console.error('Error picking document: ', error);
		}
	};

	const sendMessage = async (content, type) => {
		try {
			if (type === 'image') {
				const response = await fetch(imageUri);
				const blob = await response.blob();

				let formData = new FormData();
				formData.append(
					'conversationId',
					conversationDetails.conversationId
				);
				formData.append('file', blob);
				formData.append('type', 'image');
				const res = await messageApi.sendMessage(formData);
				if (res && res.message) {
					res.message.map((m) => {
						dispatch(addMessage({ ...m, isMyMessage: true }));
					});
				}
			} else if (type === 'file') {
				const response = await fetch(content);
				const blob = await response.blob();
				let formData = new FormData();
				formData.append(
					'conversationId',
					conversationDetails.conversationId
				);
				formData.append('file', blob);
				formData.append('type', 'file');
				const res = await messageApi.sendMessage(formData);
				if (res && res.message) {
					res.message.map((m) => {
						dispatch(addMessage({ ...m, isMyMessage: true }));
					});
				}
			} else if (type === 'text') {
				const response = await messageApi.sendMessage({
					conversationId: conversationDetails.conversationId,
					content: message,
					type: 'text',
				});
				if (response.message) {
					dispatch(
						addMessage({
							...response.message[0],
							isMyMessage: true,
						})
					);
				}
			}
		} catch (error) {
			console.error('Error when sending message: ', error);
		} finally {
			setFileUri('');
			setImageUri('');
			setMessage('');
		}
	};

	return (
		<View
			style={{
				justifyContent: 'center',
				backgroundColor: 'white',
			}}
		>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'center',
					padding: 10,
					position: 'relative',
				}}
			>
				<View
					style={{
						flexDirection: 'row',
						backgroundColor: '#f0f0f0',
						marginRight: 10,
						borderRadius: 30,
						alignItems: 'center',
						flex: 1,
						paddingHorizontal: 15,
					}}
				>
					<TouchableOpacity
						onPress={() => setShowEmojiSelector(!showEmojiSelector)}
					>
						<MaterialCommunityIcons
							name="emoticon-outline"
							size={24}
							color="black"
						/>
					</TouchableOpacity>

					<TextInput
						placeholder="Type a message"
						style={{
							backgroundColor: 'transparent',
							color: 'black',
							fontSize: 16,
							alignSelf: 'center',
							outlineWidth: 0,
							padding: 10,
							flex: 1,
						}}
						value={message}
						onChangeText={(text) => setMessage(text)}
					/>
					{imageUri && (
						<View
							style={{
								backgroundColor: 'transparent',
								borderWidth: 1,
								flexDirection: 'column',
								color: 'black',
								position: 'absolute',
								bottom: 75,
								left: 10,
								height: 100,
								width: 200,
							}}
						>
							<Text>Chọn ảnh</Text>
							<Image
								source={{ uri: imageUri }}
								style={{
									width: 200,
									height: 100,
								}}
							/>
						</View>
					)}

					{fileUri && (
						<View
							style={{
								borderColor: 'black',
								borderWidth: 1,
								position: 'absolute',
								bottom: 50,
								left: 10,
								height: 50,
								width: 200,
							}}
						>
							<Text>chọn file: {selectedFileName}</Text>
						</View>
					)}
					<TouchableOpacity onPress={pickFile}>
						<Feather name="paperclip" size={20} color="black" />
					</TouchableOpacity>
					<TouchableOpacity onPress={pickImage}>
						<Feather name="image" size={20} color="black" />
					</TouchableOpacity>
				</View>
				<TouchableOpacity
					style={{
						borderRadius: 20,
						height: 40,
						width: 40,
						alignItems: 'center',
						justifyContent: 'center',
						backgroundColor: '#139afc',
					}}
					onPress={() => {
						if (imageUri) {
							sendMessage(imageUri, 'image');
						} else if (fileUri) {
							sendMessage(fileUri, 'file');
						} else if (message.trim() !== '') {
							sendMessage(message, 'text');
						}
					}}
				>
					<MaterialCommunityIcons
						name={'send'}
						size={20}
						color="white"
					/>
				</TouchableOpacity>
			</View>
			{showEmojiSelector && (
				<EmojiSelector
					onEmojiSelected={(emoji) => setMessage(message + emoji)}
					showSearchBar={false} // Tùy chỉnh các thuộc tính khác theo nhu cầu của bạn
				/>
			)}
		</View>
	);
};

export default ChatInput;