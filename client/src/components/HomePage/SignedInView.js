import React from 'react';
import Tag from '../Tag';
import { inject, observer } from 'mobx-react';
import ProfileCard from '../ProfileCard';
import NavigationBox from '../NavigationBox';


@inject('UserStore') @observer
class SignedInView extends React.Component {
	render() {
		const { currentUser } = this.props.UserStore;
		return (
			<section className="section has-background-light">
				<div className="container">
					<div className="columns is-centered">
						<div className="column is-2">
							<NavigationBox />
						</div>
						<div className="column is-6">
							<ProfileCard
								user={currentUser}
							/>
						</div>
					</div>
				</div>
			</section>
			
		);
	}
}

export default SignedInView;
