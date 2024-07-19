import React, { useEffect } from 'react';
import {
	View,
	ScrollView,
	FlatList,
	TouchableOpacity,
	Text,
	StyleSheet,
} from 'react-native';
import { Avatar, Badge, Card } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import conversationApi from '../../api/conversationApi';
import {
	setConversationDetails,
	setConversations,
} from '../slide/ConsevationSlide';

const ChatView = ({ navigation, route }) => {
	const dispatch = useDispatch();
	const conversations = useSelector(
		(state) => state.conservation.conversations
	);
	const profile = useSelector((state) => state.profile.profile);

	useEffect(() => {
		const fetchConversations = async () => {
			try {
				const res = await conversationApi.getConversations();
				if (res) {
					dispatch(setConversations(res.conversations));
				}
			} catch (error) {
				console.error('Error fetching conversations:', error);
			}
		};

		fetchConversations();
		const unsubscribe = navigation.addListener('focus', () => {
			fetchConversations();
		});
		return unsubscribe;
	}, [dispatch, navigation]);
	return (
		<View style={{ flex: 1, backgroundColor: 'white' }}>
			<ScrollView nestedScrollEnabled>
				<FlatList
					data={conversations}
					renderItem={({ item }) => (
						<TouchableOpacity
							onPress={() => {
								dispatch(setConversationDetails(item));
								navigation.navigate('ChatDetail');
							}}
						>
							<Card>
								<Card.Content style={styles.cardContent}>
									<Avatar.Image
										size={40}
										source={{
											uri:
												item.participantIds.length > 2
													? item.avatar
													: item.membersInfo?.find(
															(member) =>
																member?.userID !==
																profile?.userID
													  )?.profilePic,
										}}
										style={styles.avatar}
									/>
									<View style={{ flex: 1 }}>
										<Card.Title
											title={
												item.participantIds.length > 2
													? item.name
													: item.membersInfo?.find(
															(member) =>
																member?.userID !==
																profile?.userID
													  )?.fullName
											}
											subtitle={
												item.lastMessage?.content ||
												'Chưa có tin nhắn nào'
											}
											titleStyle={styles.cardTitle}
										/>
									</View>
								</Card.Content>
							</Card>
						</TouchableOpacity>
					)}
					keyExtractor={(item) => item.conversationId.toString()}
				/>
			</ScrollView>
		</View>
	);
};

export default ChatView;

const styles = StyleSheet.create({
	cardContent: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	avatar: {
		marginRight: 10,
	},
	cardTitle: {
		fontSize: 16,
	},
});
