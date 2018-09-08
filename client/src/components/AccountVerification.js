import React from 'react';
import { observer, inject } from 'mobx-react';
import SpinLoad from './SpinLoad';

@inject('AuthStore') @observer
class AccountVerification extends React.Component {

	redirectToHomePage() {
		this.props.history.replace("/");
	}

	componentDidMount() {
		let hash = this.props.match.params.hash;

		// if (!isHex.test(hash)) {
		// 	return this.redirectToHomePage();
		// }

		// this.props.AuthStore.accountVerification(hash)
		// 	.then(response => {
		// 		this.redirectToHomePage();
		// 	});
	}

	render() {
		return <SpinLoad />;
	}
}

export default AccountVerification;