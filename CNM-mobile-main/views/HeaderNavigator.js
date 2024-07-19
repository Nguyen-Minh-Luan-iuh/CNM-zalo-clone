import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const HeaderNavigator = () => {
	const [searchValue, setSearchValue] = useState('');
	const navigation = useNavigation();

	const handleSearch = async () => {
		navigation.navigate('Search');
	};

	const handleCreateGroup = () => {
		navigation.navigate('CreateGroup');
	};

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
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<TouchableOpacity onPress={handleSearch}>
					<AntDesign name="search1" size={20} color="white" />
				</TouchableOpacity>
				<View
					style={{
						flex: 1,
						marginHorizontal: 20,
					}}
				>
					<TouchableOpacity onPress={handleSearch}>
						<TextInput
							placeholder="Tìm kiếm"
							style={{
								marginHorizontal: 20,
								paddingHorizontal: 10,
								height: 40,
								borderWidth: 0,
								color: 'white',
								outlineWidth: 0,
							}}
							placeholderTextColor="white"
							value={searchValue}
							onChangeText={setSearchValue}
						/>
					</TouchableOpacity>
				</View>
				<TouchableOpacity onPress={handleCreateGroup}>
					<AntDesign name="addusergroup" size={20} color="white" />
				</TouchableOpacity>
			</View>
		</LinearGradient>
	);
};

export default HeaderNavigator;
