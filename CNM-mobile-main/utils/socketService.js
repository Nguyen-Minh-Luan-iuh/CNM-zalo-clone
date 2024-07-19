import io from 'socket.io-client';

const socketService = {
	socket: null,

	initialize(userId) {
		this.socket = io('http://localhost:5000', { query: { userId } });
	},

	onMessage(event, callback) {
		if (this.socket) {
			this.socket.on(event, callback);
		}
	},

	sendMessage(event, data) {
		if (this.socket) {
			this.socket.emit(event, data);
		}
	},

	disconnect() {
		if (this.socket) {
			this.socket.disconnect();
		}
	},
};

export default socketService;
