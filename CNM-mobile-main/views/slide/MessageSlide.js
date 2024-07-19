import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	messages: [],
	loading: false,
	error: '',
	messageDetails: null,
};

const MessageSlide = createSlice({
	name: 'message',
	initialState,
	reducers: {
		readMessage: (state, action) => {
			state.messages = action.payload;
		},
		setMessageDetails: (state, action) => {
			state.messageDetails = action.payload;
		},
		addMessage: (state, action) => {
			state.messages.push(action.payload);
		},
		deleteMessage: (state, action) => {
			state.messages = state.messages.filter(
				(message) => message.messageId !== action.payload
			);
		},
		recalledMessage: (state, action) => {
			const index = state.messages.findIndex(
				(message) => message.messageId === action.payload
			);
			if (index !== -1) {
				state.messages[index].isRecalled = true;
			}
		},
		setMessages: (state, action) => {
			state.messages = action.payload;
		},
	},
});

export const {
	readMessage,
	setMessageDetails,
	addMessage,
	setMessages,
	deleteMessage,
	recalledMessage,
} = MessageSlide.actions;
export const selectMessages = (state) => state.message.messages;
export default MessageSlide.reducer;
