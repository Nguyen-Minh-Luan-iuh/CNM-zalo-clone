import React, { useEffect, useState, useRef } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	FlatList,
} from 'react-native';
import { Avatar, Badge, Card } from 'react-native-paper';
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from 'react-redux';
import {
	deleteMessage,
	readMessage,
	recalledMessage,
	selectMessages,
} from '../../slide/MessageSlide';
import Message from './Message';
import messageApi from '../../../api/messageApi';
import conversationApi from '../../../api/conversationApi';

const MessagesList = () => {
	const scrollViewRef = useRef();
	const dispatch = useDispatch();
	const messages = useSelector((state) => state.message.messages);
	const conversationDetails = useSelector(
		(state) => state.conservation.conversationDetails
	);
	const profile = useSelector((state) => state.profile.profile);

	const [isModalVisible, setModalVisible] = useState(false);
	const [isModalShareVisible, setModalShareVisible] = useState(false);

	const [listConversation, setListConversation] = useState([]);
	const [selectedMessage, setSelectedMessage] = useState(null);

	// Đồng bộ tin nhắn
	useEffect(() => {
		dispatch(readMessage(messages));
	}, [dispatch, messages]);

	useEffect(() => {
		scrollViewRef.current?.scrollToEnd({ animated: true });
	}, [messages]);

	const handlePressMessage = (message) => {
		setModalVisible(true);
		setSelectedMessage(message);
	};

	const handleRecallMessage = async () => {
		try {
			const res = await messageApi.recallMessage(
				selectedMessage.messageId
			);
			if (res.updatedMessage) {
				dispatch(recalledMessage(res.updatedMessage.messageId));
			}
		} catch (error) {
			console.error('Error when recall message: ', error);
		} finally {
			setModalVisible(false);
		}
	};

	const handleDeleteMessage = async () => {
		try {
			const res = await messageApi.deleteMessageForMeOnly(
				selectedMessage.messageId
			);
			if (res.updatedMessage) {
				dispatch(deleteMessage(selectedMessage.messageId));
			}
		} catch (error) {
			console.error('Error when delete message: ', error);
		} finally {
			setModalVisible(false);
		}
	};

	const handleShareMessage = async () => {
		try {
			const res = await conversationApi.getConversations();
			if (res) {
				setListConversation(res.conversations);
				setModalVisible(true);
			}
		} catch (error) {
			console.error('Error fetching conversations:', error);
		} finally {
			setModalVisible(false);
			setModalShareVisible(true);
		}
	};

	const handleSelectConversation = async (conversation) => {
		try {
			const res = await messageApi.shareMessage({
				checkedConversations: [conversation],
				messageContent: selectedMessage.content,
				messageType: selectedMessage.type,
			});
		} catch (error) {
			console.error('Error when share message: ', error);
		} finally {
			setModalShareVisible(true);
		}
	};

	return (
		<View style={{ flex: 1 }}>
			<ScrollView
				ref={scrollViewRef}
				contentContainerStyle={{ padding: 10 }}
			>
				{messages
					.filter(
						(message) =>
							message.deletedUserIds &&
							!message.deletedUserIds.includes(profile.userID)
					)
					.map((message) => (
						<Message
							key={message.messageId}
							message={message}
							onPress={() => handlePressMessage(message)}
							sender={conversationDetails.membersInfo.find(
								(member) => member.userID === message.senderId
							)}
						/>
					))}
			</ScrollView>

			<Modal
				isVisible={isModalVisible}
				onBackdropPress={() => setModalVisible(false)}
			>
				<View
					style={{
						backgroundColor: 'white',
						width: 200,
						margin: 'auto',
					}}
				>
					<TouchableOpacity onPress={handleShareMessage}>
						<Text
							style={{
								textAlign: 'center',
								borderBottomWidth: 1,
								padding: 10,
							}}
						>
							Chuyển tiếp
						</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={handleDeleteMessage}>
						<Text
							style={{
								textAlign: 'center',
								borderBottomWidth: 1,
								padding: 10,
							}}
						>
							Xóa
						</Text>
					</TouchableOpacity>
					{profile.userID === selectedMessage?.senderId && (
						<TouchableOpacity onPress={handleRecallMessage}>
							<Text
								style={{
									textAlign: 'center',
									borderBottomWidth: 1,
									padding: 10,
								}}
							>
								Thu hồi
							</Text>
						</TouchableOpacity>
					)}
				</View>
			</Modal>
			<Modal
				isVisible={isModalShareVisible}
				onBackdropPress={() => setModalShareVisible(false)}
			>
				<View
					style={{
						backgroundColor: 'white',
						width: 300,
						margin: 'auto',
						padding: 10,
					}}
				>
					<Text
						style={{
							fontSize: 20,
							fontWeight: 'bold',
							textAlign: 'center',
						}}
					>
						Chuyển tiếp cho{' '}
					</Text>
					<FlatList
						data={listConversation}
						renderItem={({ item }) => {
							return (
								<TouchableOpacity
									onPress={() =>
										handleSelectConversation(item)
									}
								>
									<Card>
										<Card.Content>
											<View
												style={{
													flex: 1,
													flexDirection: 'row',
													alignItems: 'center',
												}}
											>
												<Avatar.Image
													size={55}
													source={{
														uri:
															item.participantIds
																.length > 2
																? item?.avatar
																: item?.membersInfo?.find(
																		(
																			member
																		) =>
																			member.userID !==
																			profile?.userID
																  )?.profilePic,
													}}
													style={{ marginRight: 10 }}
												/>

												<View style={{ flex: 1 }}>
													<Card.Title
														title={
															item.participantIds
																.length > 2
																? item?.name
																: item?.membersInfo?.find(
																		(
																			member
																		) =>
																			member.userID !==
																			profile?.userID
																  )?.fullName
														}
														titleStyle={{
															fontSize: 18,
														}}
														subtitleStyle={{
															fontSize: 15,
														}}
													/>
												</View>
											</View>
										</Card.Content>
									</Card>
								</TouchableOpacity>
							);
						}}
						keyExtractor={(item) => item.conversationId}
					/>
				</View>
			</Modal>
		</View>
	);
};

export default MessagesList;