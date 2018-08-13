import React from 'react';

class BootstrapAlert extends React.Component {
	render() {
		return (
			<div class="alert alert-success" role="alert">
				<h4 class="alert-heading">{this.props.heading}</h4>
				<hr/>
				<p>{this.props.msg}</p>
			</div>
		);
	}
}

export default BootstrapAlert;
