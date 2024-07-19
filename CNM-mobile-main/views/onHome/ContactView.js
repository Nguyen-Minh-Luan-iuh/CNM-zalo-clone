import {
	StyleSheet,
	View,
	Text,
	Image,
	TouchableOpacity,
	FlatList,
	ScrollView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Avatar, Badge, Card, Divider, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import {
	setProfile,
	setListRequestAddFriendsSent,
	setListRequestAddFriendsReceived,
	setFriends,
	setSentRequests,
	setReceivedRequests,
} from '../slide/InfoUserSlide';
import userApi from '../../api/userApi';
const ContactView = ({ navigation }) => {
	const [selectedTab, setSelectedTab] = useState('Bạn bè');
	const [friendProfiles, setFriendProfiles] = useState([]);
	// const sortedList = friendProfiles.sort((a, b) => a.fullName.localeCompare(b.fullName));
	const addGroup = (props) => (
		<MaterialIcons name="group-add" size={25} color="#1d92fe" />
	);
	const dispatch = useDispatch();
	const profile = useSelector((state) => state.profile.profile);


	
	useEffect(() => {
		const fetchUserInfos = async () => {
			try {
				const response = await userApi.inFoUser(profile?.userID);
				const userData = response?.user;
				dispatch(setProfile({ profile: userData }));
				dispatch(
					setListRequestAddFriendsSent({
						listRequestAddFriendsSent:
							userData.listRequestAddFriendsSent,
					})
				);
				dispatch(
					setListRequestAddFriendsReceived({
						listRequestAddFriendsReceived:
							userData.listRequestAddFriendsReceived,
					})
				);
				const friendProfiles = await Promise.all(
					userData.friends.map((id) => userApi.findUserById(id))
				);
				dispatch(setFriends({ friends: friendProfiles }));
				setFriendProfiles(friendProfiles);
				const sentRequests = await Promise.all(
					userData.listRequestAddFriendsSent.map((id) =>
						userApi.findUserById(id)
					)
				);
				dispatch(setSentRequests(sentRequests));
				const receivedRequests = await Promise.all(
					userData.listRequestAddFriendsReceived.map((id) =>
						userApi.findUserById(id)
					)
				);
				dispatch(setReceivedRequests(receivedRequests));
			} catch (error) {
				console.log('fetchUserInfo:', error);
			}
		};
		fetchUserInfos();
		const unsubscribe = navigation.addListener('focus', () => {
			fetchUserInfos();
		});

		return unsubscribe;
	}, [dispatch, navigation]);
	const handleDeleteFriend = async (friendId) => {
		try {
			const response = await userApi.deleteFriend(
				profile?.userID,
				friendId
			);
			fetchUserInfos();
		} catch (error) {
			console.log('Error when delete friend:', error);
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
							borderBottomWidth: selectedTab === 'Bạn bè' ? 2 : 0,
							borderBottomColor:
								selectedTab === 'Bạn bè'
									? '#006af5'
									: 'transparent',
						}}
						onPress={() => setSelectedTab('Bạn bè')}
					>
						<Text>Bạn bè</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							height: 40,
							width: '50%',
							alignItems: 'center',
							marginTop: 10,

							borderBottomWidth: selectedTab === 'Nhóm' ? 2 : 0,
							borderBottomColor:
								selectedTab === 'Nhóm'
									? '#006af5'
									: 'transparent',
						}}
						onPress={() => setSelectedTab('Nhóm')}
					>
						<Text>Nhóm</Text>
					</TouchableOpacity>
				</View>
				<View>
					{selectedTab === 'Bạn bè' ? (
						<View style={{ flex: 1 }}>
							<View style={{ flexDirection: 'column' }}>
								<TouchableOpacity
									onPress={() =>
										navigation.navigate(
											'ShowRequestAddFriend'
										)
									}
								>
									<Card.Title
										title="Lời mời kết bạn"
										titleStyle={{
											marginLeft: 15,
											fontSize: 18,
											fontWeight: '600',
										}}
										left={(props) => (
											<View
												style={{
													backgroundColor: '#1a79fa',
													padding: 5,
													borderRadius: 5,
													alignItems: 'center',
												}}
											>
												<Ionicons
													name="people-sharp"
													size={24}
													color="white"
												/>
											</View>
										)}
									/>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() =>
										navigation.navigate('AddFriendScreen')
									}
								>
									<Card.Title
										title="Thêm bạn bè"
										subtitle="Các liên hệ có dùng Zalo"
										titleStyle={{
											marginLeft: 10,
											fontSize: 18,
											fontWeight: '600',
										}}
										left={(props) => (
											<View
												style={{
													backgroundColor: '#1a79fa',
													padding: 5,
													borderRadius: 5,
													alignItems: 'center',
												}}
											>
												<AntDesign
													name="adduser"
													size={24}
													color="white"
												/>
											</View>
										)}
										subtitleStyle={{
											marginLeft: 10,
											fontSize: 14,
										}}
									/>
								</TouchableOpacity>
							</View>
							<View style={{ flex: 1 }}>
								<Button
									icon=""
									mode="elevated"
									onPress={() => console.log('Pressed')}
									style={{ height: 40, width: 120 }}
								>
									Tất cả 172
								</Button>
							</View>
							<View style={{ flex: 8 }}>
								<FlatList
									data={friendProfiles}
									renderItem={({ item, index }) => {
										return (
											<View>
												{index === 0 ||
												item.user.fullName.charAt(0) !==
													friendProfiles[
														index - 1
													].user.fullName.charAt(
														0
													) ? (
													<View
														style={
															styles.headerContainer
														}
													>
														<Text
															style={
																styles.headerText
															}
														>
															{item.user.fullName.charAt(
																0
															)}
														</Text>
													</View>
												) : null}

												<Card.Title
													title={item.user.fullName}
													left={(props) => (
														<Avatar.Image
															size={55}
															source={{
																uri: item.user
																	.profilePic,
															}}
															style={{
																marginRight: 10,
															}}
														/>
													)}
													right={(props) => (
														<View
															style={{
																flexDirection:
																	'row',
															}}
														>
															{/* <Feather name="phone" size={24} color="black" />
                              <Feather name="video" size={24} color="black" /> */}
															<TouchableOpacity
																onPress={() =>
																	handleDeleteFriend(
																		item
																			.user
																			.userID
																	)
																}
																style={{
																	borderRadius: 10,
																	backgroundColor:
																		'red',
																	padding: 5,
																	margin: 5,
																	height: 35,
																	width: 70,
																	alignItems:
																		'center',
																	justifyContent:
																		'center',
																}}
															>
																<Text
																	style={{
																		color: 'white',
																	}}
																>
																	Huỷ kết bạn
																</Text>
															</TouchableOpacity>
														</View>
													)}
												/>
											</View>
										);
									}}
								/>
							</View>
						</View>
					) : (
						<View>
							<TouchableOpacity
								style={{
									flexDirection: 'row',
									alignItems: 'center',
								}}
								onPress={() =>
									navigation.navigate('CreateGroup')
								}
							>
								<Avatar.Icon
									size={70}
									icon={addGroup}
									style={{ backgroundColor: '#e9f5ff' }}
								/>
								<Text>Tạo nhóm mới</Text>
							</TouchableOpacity>
							<View>
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
									}}
								>
									<Avatar.Icon
										size={70}
										icon={addGroup}
										style={{ backgroundColor: '#e9f5ff' }}
									/>
									<Text>Create new group</Text>
								</View>
							</View>
						</View>
					)}
				</View>
			</View>
		</ScrollView>
	);
};

export default ContactView;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
