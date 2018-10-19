import React from 'react';
import NavigationCard from '../NavigationCard';

const mainColumnPaddingTop = {
	paddingTop: '2em'
}

class ProfileView extends React.Component {
	render() {
		return (
			<div className="columns is-gapless">
				<div className="column is-narrow has-background-white">
					<NavigationCard />
				</div>
				<div className="column">
					<div className="columns is-centered">
						<div style={mainColumnPaddingTop} className="column is-8 is-5-widescreen">
							{ this.props.children }
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default ProfileView;