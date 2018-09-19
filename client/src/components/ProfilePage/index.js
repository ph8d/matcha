import React from 'react';
import { observer, inject } from 'mobx-react';
import SignedInLayout from '../Layouts/SignedInLayout'
import ActionProfileCard from './ActionProfileCard';
import SpinLoad from '../SpinLoad';

@inject('ProfileStore') @observer
export default class extends React.Component {

	componentDidMount() {
		const { login } = this.props.match.params;
		this.props.ProfileStore.loadUser(login);
	}

	render() {
		const { user } = this.props.ProfileStore;
		if (!user) {
			return <SpinLoad />;
		} else {
			return (
				<SignedInLayout>
					<ActionProfileCard
						user={user}
					/>
				</SignedInLayout>
			);
		}
	}
}