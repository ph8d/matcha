import React from 'react';
import { observer, inject } from 'mobx-react';
import SignedInView from './SignedInView';
import SignedOutView from './SignedOutView';

@inject('user') @observer
export default class extends React.Component {
	render() {
		return (
			this.props.user.signedIn ?
			<SignedInView /> :
			<SignedOutView />
		);
	}
}