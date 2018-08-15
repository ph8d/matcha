import React from 'react';

class BootstrapAlert extends React.Component {
	render() {
		return (
			<article class="message is-success">
				<div class="message-header">
					<p>{this.props.heading}</p>
					<button class="delete" aria-label="delete"></button>
				</div>
				<div class="message-body">{this.props.msg}</div>
			</article>
		);
	}
}

export default BootstrapAlert;
