import React from 'react';
import SignedInLayout from '../Layouts/SignedInLayout';
import ConversationWindow from './ConversationWindow';
import ConversationList from './ConversationList';
import { inject, observer } from 'mobx-react';


@inject('ConversationStore') @observer
export default class extends React.Component {
	componentDidMount() {
		const { ConversationStore } = this.props;
		// ConversationStore.pullConversations();
	}

	render() {
		const { selectedConversation } = this.props.ConversationStore;

		if (selectedConversation) {
			return (
				<SignedInLayout>
					<ConversationWindow conversation={selectedConversation}/>
				</SignedInLayout>
			);
		} else {
			return (
				<SignedInLayout>
					<ConversationList/>
				</SignedInLayout>
			);
		}
	}
}
