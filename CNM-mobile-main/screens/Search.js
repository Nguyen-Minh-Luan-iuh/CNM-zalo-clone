import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import conversationApi from '../api/conversationApi';
import { setConversationDetails } from '../views/slide/ConsevationSlide';

const Search = ({ navigation, route }) => {
	const dispatch = useDispatch();
	const profile = useSelector((state) => state.profile.profile);
	const handleClickItemSearch = async (result) => {
		const res = await conversationApi.createConversation({
			participantIds: [profile.userID, result.userID],
		});
		if (res && res.conversation) {
			dispatch(setConversationDetails(res.conversation));
			navigation.navigate('ChatDetail');
		}
	};

	if (!route.params || !route.params.searchResults) {
		return (
			<View style={{ marginTop: 20 }}>
				<Text style={{ textAlign: 'center' }}>
					Không có kết quả tìm kiếm
				</Text>
			</View>
		);
	}

	const { searchResults } = route.params;
	return (
		<View>
			{searchResults.map((result, index) => (
				<TouchableOpacity
					style={{
						flexDirection: 'row',
						padding: 10,
						backgroundColor: 'white',
						borderBottomColor: '#eee',
						borderBottomWidth: 1,
					}}
					onPress={() => handleClickItemSearch(result)}
					key={index}
				>
					<Image
						source={
							result && result.profilePic
								? { uri: result.profilePic }
								: require('../images/no-avatar.jpeg')
						}
						style={{
							width: 40,
							height: 40,
							borderRadius: 20,
							marginRight: 20,
						}}
					/>
					<View>
					<Text>{result?.fullName}</Text> 
            <Text>{result?.phoneNumber}</Text>
					</View>
				</TouchableOpacity>
			))}
		</View>
	);
};

export default Search;
