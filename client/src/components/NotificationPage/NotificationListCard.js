import React from 'react';
import Notification from './Notification';
import { inject, observer } from 'mobx-react';


@inject('UserStore') @observer
class NotificationListCard extends React.Component {
	componentDidMount() {
		const { UserStore } = this.props;
		UserStore.setNotificationsSeen();
		UserStore.pullVisitHistory();
	}

	componentDidUpdate() {
		const { UserStore } = this.props;
		UserStore.setNotificationsSeen();
	}

	renderList(notifications) {
		return notifications.map((notification, i) => 
			<Notification
				key={i}
				data={notification}
			/>
		)
	}

	showVisitHistory(e) {
		const { UserStore } = this.props;
		UserStore.setShowVisitHistory(true);
	}

	showNotifications(e) {
		const { UserStore } = this.props;
		UserStore.setShowVisitHistory(false);
	}

	render() {
		const { notifications } = this.props.UserStore.currentUser;
		const { visitHistory, showVisitHistory } = this.props.UserStore

		return (
			<div className="card" style={{'minHeight': '800px'}}>
				<div className="card-content is-paddingless">
					<div className="tabs is-fullwidth is-marginless">
					<ul>
						<li className={`${!showVisitHistory && 'is-active'}`}>
							<a onClick={this.showNotifications.bind(this)}>
								<span className="icon">
									<i className="fas fa-bell"></i>
								</span>
								<span>Notifications</span>
							</a>
						</li>
						<li className={`${showVisitHistory && 'is-active'}`}>
							<a onClick={this.showVisitHistory.bind(this)}>
								<span className="icon">
									<i className="fas fa-history"></i>
								</span>
								<span>Visit history</span>
							</a>
						</li>
					</ul>
					</div>
					{
						showVisitHistory ?
						this.renderList(visitHistory) :
						this.renderList(notifications)
					}
				</div>
			</div>
		);
	}
}

export default NotificationListCard; 
