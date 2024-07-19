import {
	StyleSheet,
	Text,
	View,
	Image,
	Button,
	TouchableOpacity,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import userApi from '../api/userApi';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function ContactInfo({ route, navigation }) {
	const dispatch = useDispatch();
	const profile = useSelector((state) => state.profile.profile);

	return (
		<View style={styles.container}>
			<View
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					height: 300,
					width: '100%',
					backgroundColor: 'white',
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					paddingHorizontal: 10,
				}}
			>
				<Image
					source={{ uri: friendAvatar }}
					style={{ width: '100%', height: '100%' }}
				/>
			</View>
			<View style={styles.profileContainer}>
				<Image
					source={{ uri: friendAvatar }}
					style={styles.profileImage}
				/>
				<Text style={styles.profileName}>{friendName}</Text>
				<View style={styles.buttonContainer}>
					<Button
						title="Nhắn tin"
						onPress={() => {
							navigation.navigate('ChatDetail');
						}}
					/>
					<Button title="Gửi kết bạn" onPress={handleFriendRequest} />
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#CCCCCC',
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 300,
	},
	profileContainer: {
		alignItems: 'center',
	},
	profileImage: {
		width: 150,
		height: 150,
		borderRadius: 50,
	},
	profileName: {
		fontFamily: 'Roboto',
		fontSize: 20,
		fontWeight: 'bold',
		color: 'black',
		marginTop: 10,
	},
	buttonContainer: {
		marginTop: 10,
		width: '80%',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
});
