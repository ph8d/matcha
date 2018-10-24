import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

@inject('UserStore', 'ConversationStore', 'AuthStore') @observer
class NavigationCard extends React.Component {
	logout(e) {
		this.props.AuthStore.logout();
	}

	renderNotificationsLink(unseen) {
		if (unseen > 0) {
			return (
				<Link to="/notifications">
					<span className="icon is-size-7">
						<i className="fas fa-bell"></i>
					</span>
					<span> Notifications </span>
					<span className="tag is-size-7 is-danger has-text-weight-bold">
						<small>{unseen}</small>
					</span>
				</Link>
			);
		} else {
			return(
				<Link to="/notifications">
					<span className="icon is-size-7">
						<i className="fas fa-bell"></i>
					</span>
					<span> Notifications </span>
				</Link>
			);
		}
	}

	renderChatLink(unread) {
		if (unread > 0) {
			return (
				<Link to="/chats">
					<span className="icon is-size-7">
						<i className="fas fa-comments"></i>
					</span>
					<span> Chats </span>
					<span className="tag is-size-7 is-danger has-text-weight-bold">
						<small>{unread}</small>
					</span>
				</Link>
			);
		} else {
			return (
				<Link to="/chats">
					<span className="icon is-size-7">
						<i className="fas fa-comments"></i>
					</span>
					<span> Chats</span>
				</Link>
			);
		}
	}

	render() {
		const { unseenNotificationsCount } = this.props.UserStore;
		const { unreadConversationsCount } = this.props.ConversationStore;

		return (
			<aside className="menu box is-shadowless">
				<ul className="menu-list">
					<li>
						<Link to="/">
							<span className="icon is-size-7">
								<i className="fas fa-home"></i>
							</span>
							<span> My Profile</span>
						</Link>
					</li>
					<li>
						<Link to="/discover">
							<span className="icon is-size-7">
								<i className="fas fa-search"></i>
							</span>
							<span> Discover</span>
						</Link>
					</li>
					<li>
						{this.renderChatLink(unreadConversationsCount)}
					</li>
					<li>
						{ this.renderNotificationsLink(unseenNotificationsCount) }
					</li>
					<li>
						<Link to="/settings">
							<span className="icon is-size-7">
								<i className="fas fa-cog"></i>
							</span>
							<span> Settings</span>
						</Link>
					</li>
					<hr className="navbar-divider" />
					<li>
						<Link to="/" onClick={this.logout.bind(this)}>
							<span className="icon is-size-7">
								<i className="fas fa-sign-out-alt"></i>
							</span>
							<span> Logout</span>
						</Link>
					</li>
				</ul>
			</aside>
		);
	}
}

export default NavigationCard;