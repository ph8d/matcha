import React from 'react';
import { observer, inject } from 'mobx-react';
import SignedInLayout from '../Layouts/SignedInLayout'
import ActionProfileCard from './ActionProfileCard';
import SpinLoad from '../SpinLoad';

@inject('ProfileStore', 'UserStore') @observer
export default class extends React.Component {
	componentDidMount() {
		const { login } = this.props.match.params;
		const currentUserLogin = this.props.UserStore.currentUser.profile.login;

		if (currentUserLogin === login) {
			this.props.history.replace('/')
		} else {
			this.props.ProfileStore.loadUser(login);
		}
	}

	handleLike(e) {
		const { ProfileStore } = this.props;
		const { user } = ProfileStore;
		if (user.status.isLiked) {
			ProfileStore.unlike();
		} else {
			ProfileStore.like();
		}
	}

	handleBlock(e) {
		const { ProfileStore } = this.props;
		const { user } = ProfileStore;
		if (user.status.isBlocked) {
			ProfileStore.unblock();
		} else {
			ProfileStore.block();
		}
	}

	handleReport() {
		const { ProfileStore } = this.props;
		ProfileStore.report();
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
						handleMainAction={this.handleLike.bind(this)}
						handleBlock={this.handleBlock.bind(this)}
						handleReport={this.handleReport.bind(this)}
					/>
				</SignedInLayout>
			);
		}
	}
}