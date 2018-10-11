import React from 'react';


class SignedInView extends React.Component {
	render() {
		return (
			<nav class="navbar" aria-label="main navigation">
				<div class="navbar-brand">
					<a class="navbar-item" href="https://bulma.io">
						<img src="https://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28" />
					</a>
				
					<a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
					</a>
				</div>
			</nav>
		);
	}
}

export default SignedInView;