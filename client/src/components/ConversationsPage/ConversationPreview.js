import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { inject, observer } from 'mobx-react';


@inject('ConversationStore') @observer
class ConversationPreview extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			index: props.index
		}

		this.selectConversation = this.selectConversation.bind(this);
	}

	selectConversation(e) {
		const { ConversationStore } = this.props;
		const { index } = this.state;
		ConversationStore.selectConversation(index);
	}

	getFormattedMessage(message) {
		const result = {};
		if (!message) {
			const { data } = this.props;
			result.content = `You matched with ${data.first_name} ${data.last_name}`;
			result.date = "";
		} else {
			const { currentUser } = this.props;
			const messageDate = moment(message.date);
			if (moment().diff(messageDate, "day") > 0) {
				result.date = moment(message.date).calendar();
			} else {
				result.date = messageDate.format('HH:mm');
			}

			if (message.author_id === currentUser) {
				result.content = `You: ${message.content}`;
			} else {
				result.content = message.content;
			}
		}
		return result;
	}

	renderUnreadBadge(unreadCount) {
		if (unreadCount > 0) {
			return (
				<span className="tag is-danger has-text-weight-bold">
					{unreadCount}
				</span>
			);
		}
		return;
	}
	
	render() {
		const { data } = this.props;
		const { messages } = data;
		let lastMessage = null;
		if (messages) {
			lastMessage = messages[messages.length - 1];
		}

		const formatedMessage = this.getFormattedMessage(lastMessage);

		const noWrap = {"whiteSpace": "nowrap", "overflow": "hidden", "textOverflow": "ellipsis"}
		return (
			<div onClick={this.selectConversation} className="box is-radiusless">
				<article className="media">
					<div className="media-left">
						<figure className="image is-48x48">
							<img src={data.picture} alt="avatar"/>
						</figure>
					</div>
					<div className="media-content" style={noWrap}>
						<p>
							<span className="has-text-weight-bold">{`${data.first_name} ${data.last_name}`}</span>
							<br />
							<small className="has-text-grey">{formatedMessage.content}</small>
						</p>
					</div>
					<div className="media-right has-text-right">
						<p>
							<span className="has-text-grey is-size-7">{ formatedMessage.date }</span>
							<br/>
							{ this.renderUnreadBadge(data.unread) }
						</p>
					</div>
				</article>
			</div>
		);
	}
}

export default ConversationPreview;
