import React from 'react';
import Notification from './Notification';
import { inject, observer } from 'mobx-react';


@inject('UserStore') @observer
class NotificationListCard extends React.Component {
	componentDidMount() {
		const { UserStore } = this.props;
		UserStore.setNotificationsSeen();
	}

	componentDidUpdate() {
		const { UserStore } = this.props;
		UserStore.setNotificationsSeen();
	}

	renderNotifications(notifications) {
		return notifications.map((notification, i) => 
			<Notification
				key={i}
				data={notification}
			/>
		)
	}

	render() {
		const { notifications } = this.props.UserStore.currentUser;

		return (
			<div className="card" style={{'minHeight': '800px'}}>
				<header className="card-header">
					<p className="card-header-title is-centered">
						Notifications
					</p>
				</header>
				<div className="card-content is-paddingless">
					{this.renderNotifications(notifications)}
				</div>
			</div>
		);
	}
}

export default NotificationListCard; 
