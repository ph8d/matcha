import React from 'react';

class BootstrapAlert extends React.Component {
	render() {
		// console.log(this.props.match.params);
		return (
			<div className={`notification ${this.props.className}`}>
				<button className="delete" onClick={this.props.closeNotification}></button>
				<strong>{this.props.heading}</strong>
				<p>{this.props.msg}</p>
			</div>
		);
	}
}

export default BootstrapAlert;
