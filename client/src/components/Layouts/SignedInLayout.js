import React from 'react';
import NavigationCard from '../NavigationCard';

class ProfileView extends React.Component {
	render() {
		return (
			<section className="section has-background-light">
				<div className="container">
					<div className="columns is-centered">
						<div className="column is-3">
							<NavigationCard />
						</div>
						<div className="column is-6">
							{ this.props.children }
						</div>
					</div>
				</div>
			</section>
		);
	}
}

export default ProfileView;