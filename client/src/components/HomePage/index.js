import React from 'react';
import SignedInView from './SignedInView';
import SignedOutView from './SignedOutView';
import { observer, inject } from 'mobx-react';


@inject('UserStore') @observer
export default class extends React.Component {
	render() {
		return (
			this.props.UserStore.currentUser ?
			<SignedInView /> :
			<SignedOutView />
		);
	}
}