import React from 'react';
import ConversationPreview from './ConversationPreview';
import SpinLoad from '../SpinLoad';
import { inject, observer } from 'mobx-react';


@inject('ConversationStore', 'UserStore') @observer
class ChatList extends React.Component {
	renderConversations(conversations, user_id) {
		return conversations.map((conversation, index) => 
			<ConversationPreview
				index={index}
				key={conversation.conversation_id}
				data={conversation}
				currentUser={user_id}
			/>
		);
	}

	render() {
		const { ConversationStore, UserStore } = this.props;
		const { isLoading, conversations } = ConversationStore;
		const { user_id } = UserStore.currentUser.profile;
		console.log('rendering list');

		return (
			<div className="card" style={{'minHeight': '800px'}}>
				<header className="card-header">
					<p className="card-header-title is-centered">
						Chats
					</p>
				</header>
				<div className="card-content is-paddingless">
				{
					isLoading ?
					<SpinLoad/> :
					this.renderConversations(conversations, user_id)
				}
				</div>
			</div>
		);
	}
}

export default ChatList;
