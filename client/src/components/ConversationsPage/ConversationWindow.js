import React from 'react';
import Message from './Message';
import TextareaAutosize from 'react-textarea-autosize';
import SpinLoad from '../SpinLoad';
import './scrollbar.css';
import { inject, observer } from 'mobx-react';
import moment from 'moment';


@inject('UserStore', 'ConversationStore', 'SocketStore') @observer
class ChatList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			conversationId: props.conversation.conversation_id,
			value: ''
		}
		this.handleInput = this.handleInput.bind(this);
		this.scrollToBottom = this.scrollToBottom.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
	}

	componentDidMount() {
		this.scrollToBottom();
	}

	componentDidUpdate(prevProps) {
		this.scrollToBottom();
	}

	componentWillUnmount() {
		const { ConversationStore } = this.props;
		ConversationStore.unsetSelectedConversation();
	}

	sendMessage() {
		const value = this.state.value.trim();
		if (!value) return;
		const { ConversationStore } = this.props;
		const { conversationId } = this.state;
		ConversationStore.sendMessage(conversationId, value.trim());
		this.setState({ value: '' });
	}

	handleKeyDown(e) {
		if (e.key === 'Enter') {
			e.preventDefault();
			this.sendMessage();
		}
	}

	handleInput(e) {
		const { value } = e.target;
		if (value.length > 500) return;
		this.setState({ value });
	}

	unsetSelectedConversation() {
		const { ConversationStore } = this.props;
		ConversationStore.unsetSelectedConversation();
	}

	scrollToBottom() {
		this.messagesEnd.scrollIntoView();
	}

	renderMessages(messages) {
		if (!messages) return <SpinLoad />;
		const { user_id } = this.props.UserStore.currentUser.profile;
		return messages.map((message, index) =>
			<Message
				isIncoming={!(message.author_id === user_id)}
				text={message.content}
				date={message.date}
				key={index}
			/>
		);
	}

	renderDropDownMenu() {
		return (
			<div className="dropdown is-hoverable is-right is-pulled-right">
				<div className="dropdown-trigger">
					<a className="has-text-dark" aria-haspopup="true" aria-controls="dropdown-menu6">
						<span className="icon">
							<i className="fas fa-ellipsis-v"></i>
						</span>
					</a>
				</div>
				<div className="dropdown-menu" id="dropdown-menu6" role="menu">
					<div className="dropdown-content">
						<a className="dropdown-item">
							Block
						</a>
						<a className="dropdown-item">
							Report
						</a>
					</div>
				</div>
			</div>
		);
	}

	renderStatus(online, last_seen) {
		let result = '';

		if (online === 1) {
			result = 'Online';
		} else {
			const currentDate = moment();
			const lastSeen = moment(last_seen);

			if (currentDate.diff(lastSeen, 'days') > 0) {
				result = `last seen ${lastSeen.format('D MMM HH:mm')}`;
			} else {
				result = `last seen ${lastSeen.format('HH:mm')}`;
			}
		}
		return (
			<small className="has-text-grey">
				{result}
			</small>
		);
	}

	renderCardHeader(conversation) {
		const { first_name, last_name, online, last_seen } = conversation;
		return (
			<header className="card-header">
				<p onClick={this.unsetSelectedConversation.bind(this)} className="card-header-icon">
					<a className="has-text-dark">
						<span className="icon">
							<i className="fas fa-arrow-left"></i>
						</span>
					</a>
				</p>
				<p className="card-header-title is-centered">
					<span>{`${first_name} ${last_name}`}</span>
					&nbsp;
					{ this.renderStatus(online, last_seen) }
				</p>
				<div className="card-header-icon">
					{ this.renderDropDownMenu() }
				</div>
			</header>
		);
	}

	renderCardBody(messages) {
		return (
			<div className="card-content" style={{'minHeight': '600px', 'maxHeight': '600px', 'overflow': 'scroll', 'overflowX': 'hidden'}}>
				<div className="tile is-ancestor">
					<div className="tile is-parent is-vertical">
						{ this.renderMessages(messages) }
					</div>
				</div>
				<div style={{ float:"left", clear: "both" }}
					ref={(el) => { this.messagesEnd = el; }}>
				</div>
			</div>
		);
	}

	renderCardFooter() {
		return (
			<footer className="card-footer">
				<div className="card-footer-item is-paddingless field has-addons">
					<div className="control is-expanded">
						<TextareaAutosize
							onKeyDown={this.handleKeyDown.bind(this)}
							onChange={this.handleInput}
							value={this.state.value}
							rows="1"
							maxRows={3}
							className="textarea is-radiusless is-shadowless"
							placeholder="Write a message..."
							style={{'resize': 'none', 'border': 'none'}}
						/>
					</div>
					<div className="control">
						<button
							onClick={this.sendMessage}
							className="button is-large is-radiusless is-white has-text-dark"
							style={{"border": "none"}}
						>
							<span className="icon">
								<i className="fas fa-paper-plane"></i>
							</span>
						</button>
					</div>
				</div>
			</footer>
		);
	}

	render() {
		const { conversation } = this.props;
		const { messages } = conversation;

		return (
			<div className="card">
				{ this.renderCardHeader(conversation) }
				{ this.renderCardBody(messages) }
				{ this.renderCardFooter() }
			</div>
		);
	}
}

export default ChatList;
