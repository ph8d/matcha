import { observable, action, reaction } from 'mobx'
import io from 'socket.io-client';

import UserStore from './UserStore';
import ConversationStore from './ConversationStore';

class SocketStore {
	socket = null;

	connect(user_id) {
		this.socket = io('http://localhost:5000', { query: { user_id } });
		
		this.socket.on('new message', message => {
			ConversationStore.pushMsgToCurrentConv(message);
		});

		this.socket.on('notification', notification => {
			console.log('New notification!', notification);
			const { type, data } = notification;
			if (type === 'message') {
				ConversationStore.pushMessage(data);
			} else {
				UserStore.pushNewNotification(notification);
			}
		});
	}

	emit(eventName, data) {
		this.socket.emit(eventName, data);
	}

	disconnect() {
		this.socket.disconnect();
	}
}

export default new SocketStore();