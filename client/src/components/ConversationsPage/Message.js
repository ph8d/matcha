import React from 'react';
import moment from 'moment';

const maxWidthStyle = {
	'maxWidth': '300px',
	'overflowWrap': 'break-word'
};

class Message extends React.Component {
	getFormatedDate(date) {
		const messageDate = moment(date);
		const currentDate = moment();

		if (currentDate.diff(messageDate, "day") > 0) {
			return messageDate.calendar();
		} else {
			return messageDate.format('HH:mm');
		}
	}

	renderInMessage(text, date) {
		return (
			<div className="tile is-child is-flex">
				<div style={maxWidthStyle} className="box is-marginless">
					<p>
						<small>{text}</small>
					</p>
					<p className="has-text-grey-light is-size-7 has-text-right">
						<small>{ this.getFormatedDate(date) }</small>
					</p>
				</div>
			</div>
		);
	}

	renderOutMessage(text, date) {
		return (
			<div className="tile is-child is-flex" style={{"justifyContent": "flex-end"}}>
				<div style={maxWidthStyle} className="box is-marginless has-background-light is-shadowless">
					<p style={{}}>
						<small>{text}</small>
					</p>
					<p className="has-text-grey-light is-size-7 has-text-right">
						<small>{ this.getFormatedDate(date) }</small>
					</p>
				</div>
			</div>
		);
	}

	render() {
		const { isIncoming, text, date } = this.props;
		if (isIncoming) {
			return this.renderInMessage(text, date);
		} else {
			return this.renderOutMessage(text, date);
		}
	}
}

export default Message;
