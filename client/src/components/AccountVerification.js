import React from 'react';
import { observer, inject } from 'mobx-react';
import SpinLoad from './SpinLoad';

@inject('AuthStore') @observer
class AccountVerification extends React.Component {
	componentDidMount() {
		let isHex = new RegExp(/^[0-9a-f]*$/i);
		let hash = this.props.match.params.hash;

		if (!isHex.test(hash)) {
			return this.setState({ redirect: true });
		}

		this.props.AuthStore.accountVerification(hash)
			.then(response => {
				this.props.history.replace("/");
			});
	}

	render() {
		return <SpinLoad />;
	}
}

export default AccountVerification;