import React from 'react';
import { inject, observer } from 'mobx-react';
import SignedInLayout from '../Layouts/SignedInLayout'
import ProfileCard from './ProfileCard';


@inject('UserStore') @observer
class SignedInView extends React.Component {
	render() {
		const { currentUser } = this.props.UserStore;
		return (
			<SignedInLayout>
				<ProfileCard
					user={currentUser}
				/>
			</SignedInLayout>
		);
	}
}

export default SignedInView;
