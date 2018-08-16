import React from 'react';

class BootstrapAlert extends React.Component {
	render() {
		return (
			<div className="notification is-dark">
				<button className="delete"></button>
				<strong>{this.props.heading}</strong>
				<p>{this.props.msg}</p>
			</div>
		);
	}
}

export default BootstrapAlert;