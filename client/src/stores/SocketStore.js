import io from 'socket.io-client';

import iziToast from 'izitoast';

import UserStore from './UserStore';
import ConversationStore from './ConversationStore';

iziToast.settings({
	theme: 'dark',
	position: 'bottomRight',
	progressBarColor: 'white',
	transitionIn: 'fadeInUp',
	transitionInMobile: 'fadeInUp',
	animateInside: false,
	drag: false
})

class SocketStore {
	socket = null;

	connect(user_id) {
		this.socket = io('http://localhost:5000', { query: { user_id } });
		
		this.socket.on('new message', message => {
			ConversationStore.pushMsgToCurrentConv(message);
		});

		this.socket.on('status update', status => {
			ConversationStore.updateUserStatus(status);
		});

		this.socket.on('notification', notification => {
			const toast = {
				title: `${notification.first_name} ${notification.last_name}`,
				image: notification.picture
			}
			const { type_id } = notification;

			if (type_id === 1) {
				toast.message = "Visited your profile";
			} else if (type_id === 2) {
				toast.message = "Liked you";
			} else if (type_id === 3) {
				const { actor_user } = notification;
				toast.message = "Unliked you";
				ConversationStore.removeConvByUserId(actor_user);
			} else if (type_id === 4) {
				toast.message = "Matched with you";
				ConversationStore.pullConversations();
			} else if (type_id === 5) {
				const { message } = notification;
				ConversationStore.pushMessage(message);
				toast.message = `Message: ${message.content}`
				toast.layout = 2;
				return iziToast.show(toast);
			}

			UserStore.pushNewNotification(notification);
			iziToast.show(toast);
		});
	}

	emit(eventName, ...args) {
		this.socket.emit(eventName, ...args);
	}

	disconnect() {
		this.socket.disconnect();
	}
}

export default new SocketStore();