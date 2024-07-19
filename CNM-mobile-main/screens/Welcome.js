import {
	StyleSheet,
	View,
	Text,
	Image,
	FlatList,
	TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import SlideShow from '../views/SlideShow';
import { LinearGradient } from 'expo-linear-gradient';
import { clearProfile } from '../views/slide/ProfileSlide';
import { useDispatch, useSelector } from 'react-redux';
import { persistor } from '../views/store';

const Welcome = ({ navigation }) => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(clearProfile());
		persistor.purge();
	}, []);
	return (
		<View style={styles.container}>
			<View
				style={{
					marginTop: 40,
					height: 70,
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Image
					source={require('../images/zlogo.png')}
					style={{ height: 60, width: 100 }}
					resizeMode="contain"
				></Image>
			</View>
			<View>
				<SlideShow />
			</View>

			<View
				style={{
					flexDirection: 'column',
					justifyContent: 'space-between',
					alignItems: 'center',
					padding: 10,
				}}
			>
				<LinearGradient
					colors={['#4c669f', '#3b5998', '#192f6a']}
					style={{ height: 50, width: 250, borderRadius: 20 }}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
				>
					<TouchableOpacity
						style={{
							flex: 1,
							justifyContent: 'center',
							alignItems: 'center',
						}}
						onPress={() => {
							navigation.navigate('Login');
						}}
					>
						<Text style={{ color: 'white' }}>Đăng Nhập</Text>
					</TouchableOpacity>
				</LinearGradient>
				<TouchableOpacity
					onPress={() => {
						navigation.navigate('SignUp');
					}}
					style={{
						height: 50,
						width: 250,
						borderRadius: 20,
						backgroundColor: '#00a3ff',
						justifyContent: 'center',
						alignItems: 'center',
						marginTop: 20,
					}}
				>
					<Text style={{ color: 'white' }}>Đăng Ký</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default Welcome;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	button: {
		marginRight: 10,
	},
	text: {
		borderBottomWidth: 3,
		borderBottomColor: 'black',
	},
});
