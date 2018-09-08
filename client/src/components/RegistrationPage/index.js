import React from 'react';
import { observer, inject } from 'mobx-react';
import RegistrationView from './RegistrationView';
import SpinLoad from '../SpinLoad';

@inject('AuthStore', 'UserStore', 'RegistrationStore') @observer
export default class extends React.Component {
	constructor(props) {
		super(props);
		this.state = { isLoading: true };
		this.redirectToHome = this.redirectToHome.bind(this);
	}

	redirectToHome(url) {
		this.props.history.replace("/");
	}

	componentDidMount() {
		const { hash } = this.props.match.params;
		const { RegistrationStore } = this.props;

		RegistrationStore.verifyHash(hash)
			.then(response => {
				if (!response.data.status) {
					this.redirectToHome();
				} else {
					this.setState({ isLoading: false });
					RegistrationStore.loadDataFromLocalStore();
					RegistrationStore.getLocationByIp();
				}
			})
			.catch(error => {
				console.error(error);
				this.props.redirectToHome();
			})
	}

	render() {
		let { isLoading } = this.state;

		if (isLoading) {
			return <SpinLoad />
		}
		return (
			<RegistrationView
				redirectToHome={this.redirectToHome}
				hash={this.props.match.params.hash}
			/>
		);
	}
}