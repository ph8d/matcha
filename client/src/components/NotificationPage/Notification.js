import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

class ContainerCard extends React.Component {
	renderDate(date) {
		const notificationDate = moment(date);
		const currentDate = moment();

		if (currentDate.diff(notificationDate, "day") > 0) {
			return notificationDate.format('D MMMM HH:mm');
		} else {
			return notificationDate.format('HH:mm');
		}
	}

	renderText(type_id) {
		let text = '';
		if (type_id === 1) {
			text = "Visited your profile";
		} else if (type_id === 2) {
			text = "Liked you";
		} else if (type_id === 3) {
			text = "Unliked you";
		} else if (type_id === 4) {
			text = "Matched with you";
		} else {
			text = "Unknown notification type id"
		}
		return <span>{text}</span>;
	}

	render() {
		const { type_id, picture, first_name, last_name, login, date } = this.props.data;
		return (
			<Link to={`/profile/${login}`}>
				<div className="box is-radiusless">
					<article className="media">
						<div className="media-left">
							<figure className="image is-48x48">
								<img src={picture} alt="avatar"/>
							</figure>
						</div>
						<div className="media-content">
							<p>
								<span className="has-text-weight-bold">
									{`${first_name} ${last_name} `}
								</span>
								{ this.renderText(type_id) }
							</p>
							<p>
								<span className="has-text-grey is-size-7">
									{ this.renderDate(date) }
								</span>
							</p>
						</div>
					</article>
				</div>
			</Link>
		);
	}
}

export default ContainerCard; 
