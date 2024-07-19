import React, { useEffect, useState } from 'react';
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	FlatList,
	ScrollView,
	Button
} from 'react-native';
import { Avatar, Card } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import {
	setListRequestAddFriendsSent,
	setListRequestAddFriendsReceived,
} from '../views/slide/InfoUserSlide';
import userApi from '../api/userApi';
import Modal from 'react-native-modal';

const ShowRequestAddFriend = ({ navigation }) => {
	const sentRequests = useSelector((state) => state.user?.sentRequests);
	const receivedRequests = useSelector((state) => state.user?.receivedRequests);
	const [selectedTab, setSelectedTab] = useState('Đã nhận');
	const dispatch = useDispatch();
	const profile = useSelector((state) => state.profile.profile);
	const [isModalVisible, setModalVisible] = useState(false);
	const [modalMessage, setModalMessage] = useState('');
	const [modalCallback, setModalCallback] = useState(null);

	const showToast = (message, callback) => {
		setModalMessage(message);
		setModalCallback(() => callback);
		setModalVisible(true);
	};

	const hideModal = () => {
		setModalVisible(false);
		if (modalCallback) {
			modalCallback();
			setModalCallback(null);
		}
	};

	useEffect(() => {
		const fetchRequests = async () => {
			try {
				const response = await userApi.getFriendRequests(profile?.userID);
				dispatch(setListRequestAddFriendsSent(response.sentRequests));
				dispatch(setListRequestAddFriendsReceived(response.receivedRequests));
			} catch (error) {
				console.error('Error fetching friend requests:', error);
			}
		};
		fetchRequests();
		const unsubscribe = navigation.addListener('focus', () => {
			fetchRequests();
		});

		return unsubscribe;
	}, [dispatch, profile?.userID, navigation]);

	const handleAddFriend = async (friendId) => {
		try {
			await userApi.addFriend(profile?.userID, friendId);
			showToast('kết bạn thành công', () => navigation.navigate('Home'));
		} catch (error) {
			console.error('Error when sending friend request:', error);
			showToast('kết bạn thất bại');
		}
	};

	const handleCancelFriend = async (friendId) => {
		try {
			await userApi.cancelRequestAddFriends(profile?.userID, friendId);
			showToast('huỷ yêu cầu kết bạn thành công', () => navigation.navigate('Home'));
		} catch (error) {
			console.error('Error when canceling friend request:', error);
			showToast('huỷ yêu cầu kết bạn thất bại');
		}
	};

	return (
		<ScrollView nestedScrollEnabled>
			<View style={styles.container}>
				<View style={{ height: 75, flexDirection: 'row' }}>
					<TouchableOpacity
						style={{
							height: 40,
							width: '50%',
							alignItems: 'center',
							marginTop: 10,
							borderBottomWidth:
								selectedTab === 'Đã nhận' ? 2 : 0,
							borderBottomColor:
								selectedTab === 'Đã nhận'
									? '#006af5'
									: 'transparent',
						}}
						onPress={() => setSelectedTab('Đã nhận')}
					>
						<Text>Đã nhận</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							height: 40,
							width: '50%',
							alignItems: 'center',
							marginTop: 10,
							borderBottomWidth: selectedTab === 'Đã gửi' ? 2 : 0,
							borderBottomColor:
								selectedTab === 'Đã gửi'
									? '#006af5'
									: 'transparent',
						}}
						onPress={() => setSelectedTab('Đã gửi')}
					>
						<Text>Đã gửi</Text>
					</TouchableOpacity>
				</View>
				<View>
					{selectedTab === 'Đã gửi' ? (
						<View style={{ flex: 1 }}>
							<View style={{ flex: 8 }}>
								<FlatList
									data={sentRequests}
									renderItem={({ item }) => (
										<View>
											<View style={styles.headerContainer}>
												<Text style={styles.headerText}>
													{item.user.fullName}
												</Text>
											</View>

											<Card.Title
												title={item.user.fullName}
												left={(props) => (
													<Avatar.Image
														size={55}
														source={{
															uri: item.user.profilePic,
														}}
														style={{ marginRight: 10 }}
													/>
												)}
												right={(props) => (
													<View style={{ flexDirection: 'row' }}>
														<TouchableOpacity
															onPress={() => handleCancelFriend(item.user.userID)}
															style={styles.cancelButton}
														>
															<Text style={styles.buttonText}>
																thu hồi
															</Text>
														</TouchableOpacity>
													</View>
												)}
											/>
										</View>
									)}
								/>
							</View>
						</View>
					) : (
						<View style={{ flex: 1 }}>
							<View style={{ flex: 8 }}>
								<FlatList
									data={receivedRequests}
									renderItem={({ item }) => (
										<View>
											<View style={styles.headerContainer}>
												<Text style={styles.headerText}>
													{item.user.fullName}
												</Text>
											</View>

											<Card.Title
												title={item.user.fullName}
												left={(props) => (
													<Avatar.Image
														size={55}
														source={{
															uri: item.user.profilePic,
														}}
														style={{ marginRight: 10 }}
													/>
												)}
												right={(props) => (
													<View style={{ flexDirection: 'row' }}>
														<TouchableOpacity
															onPress={() => handleAddFriend(item.user.userID)}
															style={styles.acceptButton}
														>
															<Text style={styles.buttonText}>
																đồng ý kết bạn
															</Text>
														</TouchableOpacity>
														<TouchableOpacity
															onPress={() => handleCancelFriend(item.user.userID)}
															style={styles.cancelButton}
														>
															<Text style={styles.buttonText}>
																huỷ
															</Text>
														</TouchableOpacity>
													</View>
												)}
											/>
										</View>
									)}
								/>
							</View>
						</View>
					)}
				</View>
				<Modal isVisible={isModalVisible} onBackdropPress={hideModal}>
					<View style={{backgroundColor: 'white', padding: 20}}>
						<Text>{modalMessage}</Text>
						<Button title="Close" onPress={hideModal} />
					</View>
				</Modal>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	headerContainer: {
		padding: 10,
	},
	headerText: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	acceptButton: {
		borderRadius: 10,
		backgroundColor: 'green',
		padding: 5,
		margin: 5,
		height: 35,
		width: 70,
		alignItems: 'center',
		justifyContent: 'center',
	},
	cancelButton: {
		borderRadius: 10,
		backgroundColor: 'grey',
		padding: 5,
		margin: 5,
		height: 35,
		width: 70,
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonText: {
		color: 'white',
	},
});

export default ShowRequestAddFriend;
