import React from 'react';
import { Redirect } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import PasswordResetView from './PasswordResetView';


@inject('AuthStore', 'UserStore') @observer
export default class extends React.Component {
	constructor(props) {
		super(props);
		this.componentWillUnmount = this.componentWillUnmount.bind(this);
		this.redirectToHomePage = this.redirectToHomePage.bind(this);
	}

	componentWillUnmount() {
		this.props.AuthStore.clearValues();
		this.props.AuthStore.clearErrors();
	}

	redirectToHomePage(url) {
		this.props.history.replace("/");
	}

	render() {
		if (this.props.UserStore.currentUser) {
			return <Redirect to="/" />;
		} else {
			return (
				<PasswordResetView
					hash={this.props.match.params.hash}
					redirectToHomePage={this.redirectToHomePage}
				/>
			);
		}
	}
}