import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import userApi from '../api/userApi';

const HeaderBack = () => {
	const navigation = useNavigation();
	const [searchValue, setSearchValue] = useState('+8433');

	const handleGoBack = () => {
		navigation.goBack();
	};

	const handleSearch = async () => {
		try {
			const res = await userApi.findUser(searchValue);
			navigation.navigate('Search', { searchResults: res.users });
		} catch (error) {
			console.error('Lỗi khi tìm kiếm người dùng:', error);
		}
	};
	useEffect(() => {
		handleSearch();
	}, []);

	return (
		<LinearGradient
			colors={['#247bfe', '#139afc', '#02b9fa']}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 0 }}
			style={{
				height: 60,
				justifyContent: 'center',
				paddingHorizontal: 10,
			}}
		>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					marginLeft: 10,
				}}
			>
				<TouchableOpacity onPress={handleGoBack}>
					<AntDesign name="arrowleft" size={20} color="white" />
				</TouchableOpacity>
				<TextInput
					placeholder="Tìm kiếm"
					style={{
						marginHorizontal: 20,
						paddingHorizontal: 10,
						height: 40,
						borderWidth: 0,
						width: '100%',
						color: 'white',
						outlineWidth: 0,
					}}
					placeholderTextColor="white"
					value={searchValue}
					onChangeText={setSearchValue}
				/>
				<TouchableOpacity onPress={handleSearch}>
					<AntDesign name="search1" size={20} color="white" />
				</TouchableOpacity>
			</View>
		</LinearGradient>
	);
};

export default HeaderBack;
