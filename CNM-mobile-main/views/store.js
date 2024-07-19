import { combineReducers, configureStore } from '@reduxjs/toolkit';
import conservationReducer from '../views/slide/ConsevationSlide';
import loginReducer from '../views/slide/LoginSlide';
import messageReducer from '../views/slide/MessageSlide';
import profilerReducer from '../views/slide/ProfileSlide';
import InfoUserReducer from './slide/InfoUserSlide';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';

const rootReducer = combineReducers({
	conservation: conservationReducer,
	message: messageReducer,
	profile: profilerReducer,
	auth: loginReducer,
	user: InfoUserReducer,
});

const presistConfig = {
	key: 'root',
	storage: AsyncStorage,
	whitelist: ['auth', 'isLogin'],
	blacklist: ['register'],
};
const persistedReducer = persistReducer(presistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export const persistor = persistStore(store);
