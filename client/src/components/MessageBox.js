import React from 'react';
import PropTypes from 'prop-types';

class MessageWindow extends React.Component {
	render() {
		let { heading, text } = this.props;
		return (
			<div className="card">
				<header className="card-header">
					<p className="card-header-title">{ heading }</p>
				</header>
				<div className="card-content">
					<div className="content">
						<p>{ text }</p>
						<p className="has-text-centered">
							<button onClick={this.props.onButtonClick} className="button is-centered is-radiusless is-dark is-fullwidth">OK</button>
						</p>
					</div>
				</div>
			</div>
		);
	}
}

MessageWindow.propTypes = {
	heading: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired,
	onButtonClick: PropTypes.func
}

export default MessageWindow;