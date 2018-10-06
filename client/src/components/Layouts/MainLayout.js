import React from 'react';
import NavigationCard from '../NavigationCard';

class MainLayout extends React.Component {
	render() {
		return (
			<div className="columns is-gapless">
				<div className="column is-narrow has-background-white">
					<NavigationCard />
				</div>
				<div className="column">
					{ this.props.children }
				</div>
			</div>
		);
	}
}

export default MainLayout;
