import React from 'react';
import SignedInLayout from '../Layouts/SignedInLayout';
import ProfileEditCard from './ProfileEditCard';
import SpinLoad from '../SpinLoad';
import { observer, inject } from 'mobx-react';


@inject('ProfileEditStore') @observer
export default class extends React.Component {
	componentDidMount() {
		this.props.ProfileEditStore.loadUser();
	}

	componentWillUnmount() {
		const { ProfileEditStore } = this.props;
		ProfileEditStore.resetStore();
		ProfileEditStore.unsetUser();
	}

	render() {
		const { user } = this.props.ProfileEditStore;

		return (
			<SignedInLayout>
				{
					user ?
					<ProfileEditCard /> :
					<SpinLoad/>
				}
			</SignedInLayout>
		);
	}
}