import { observable, action, computed } from 'mobx';
import API from '../helpers/api';
import UserStore from './UserStore';
import SocketStore from './SocketStore';
import moment from 'moment';

class ConversationStore {
	@observable isLoading = false;
	
	@observable conversations = [];
	@observable selectedIndex = null;

	@computed get selectedConversation() {
		if (this.selectedIndex === null) return null;
		return this.conversations[this.selectedIndex];
	}

	@computed get unreadConversationsCount() {
		let count = 0;
		this.conversations.forEach(conversation => {
			if (conversation.unread > 0) {
				count++;
			}
		});
		return count;
	}

	@action setIsLoading(status) {
		this.isLoading = status;
	}

	@action setConversations(conversations) {
		this.conversations = conversations;
	}

	@action setMessages(messages) {
		this.conversations[this.selectedIndex].messages = messages;
	}

	@action selectConversation(index) {
		this.selectedIndex = index;
		this.selectedConversation.unread = 0;
		this.pullMessagesForSelectedConv();
		this.joinConversation();
	}

	@action unsetSelectedConversation() {
		this.leaveConversation();
		this.selectedIndex = null;
	}

	@action pushMsgToCurrentConv(message) {
		this.selectedConversation.messages.push(message);
	}

	@action pushMessage(message) {
		const id = message.conversation_id;
		const lenght = this.conversations.length;
		
		for (let i = 0; i < lenght; i++) {
			if (this.conversations[i].conversation_id === id) {
				this.conversations[i].messages.push(message);
				this.conversations[i].unread++;
				return;
			}
		}

		const dummyConversation = {
			conversation_id: id,
			unread: 1,
			messages: [message]
		}

		this.conversations.push(dummyConversation);
	}

	async pullConversations() {
		this.setIsLoading(true);
		const response = await API.Conversations.getPreviews();
		if (response.status === 200) {
			this.setConversations(response.data);
		}
		this.setIsLoading(false);
	}

	async pullMessagesForSelectedConv() {
		if (this.selectedIndex === null) return;
		this.setIsLoading(true);
		const { login } = this.selectedConversation;
		const response = await API.Conversations.get(login); // Can be a POST request with conv_id
		if (response.status === 200) {
			this.setMessages(response.data);
		}
		this.setIsLoading(false);
	}

	joinConversation() {
		const { user_id } = UserStore.currentUser.profile;
		const { conversation_id } = this.selectedConversation;
		SocketStore.emit('join conversation', {conversation_id, user_id});
	}

	leaveConversation() {
		if (this.selectedIndex === null) return;
		const { conversation_id } = this.selectedConversation;
		SocketStore.emit('leave conversation', conversation_id);
	}

	sendMessage(conversation_id, content) {
		const recipient = this.selectedConversation.user_id;
		const author_id = UserStore.currentUser.profile.user_id;
		const date = moment().format('YYYY-MM-DD HH:mm:ss');

		const message = {
			conversation_id,
			author_id,
			content,
			date
		};

		const data = {
			recipient,
			message
		}

		SocketStore.emit('send message', data);
		this.pushMsgToCurrentConv(message);
	}

	clearConversations() {
		this.conversations = [];
		this.selectedIndex = null;
	}

}

export default new ConversationStore();
