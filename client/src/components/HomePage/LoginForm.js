import React from 'react';
import BaseInputField from '../BaseInputField';
import { inject, observer } from 'mobx-react';


@inject('AuthStore') @observer
class LoginForm extends React.Component {
	constructor(props) {
		super(props);

		this.handleInput = this.handleInput.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.triggerAccountRecovery = this.triggerAccountRecovery.bind(this);
	}

	triggerAccountRecovery(e) {
		this.props.AuthStore.accountRecovery()
	}

	handleInput(e) {
		this.props.AuthStore.setFieldValue(e.target.name, e.target.value);
	}

	onSubmit(e) {
		e.preventDefault();
		this.props.AuthStore.login();
	}

	componentWillUnmount() {
		this.props.AuthStore.clearValues();
		this.props.AuthStore.clearErrors();
	}

	render() {
		const { values, errors, isLoading } = this.props.AuthStore;

		let btnStatus = isLoading ? 'disabled' : '';
		let btnLoadingClass = isLoading ? 'is-loading' : '';

		return (
			<form onSubmit={this.onSubmit}>
				<BaseInputField
					name="email"
					labelText="Email"
					type="email"
					value={values.email}
					error={errors.email}
					onChange={this.handleInput}
				/>

				<BaseInputField
					name="password"
					labelText="Password"
					type="password"
					value={values.password}
					error={errors.password}
					onChange={this.handleInput}
				/>
				<button disabled={btnStatus} onClick={this.triggerAccountRecovery} className="button is-small is-white is-text has-text-dark " type="button">Forgot your password?</button>
				<hr/>
				<button disabled={btnStatus} id="submit" className={`button is-radiusless is-dark is-medium is-fullwidth ${btnLoadingClass}`} type="submit">Login</button>
			</form>
		);
	}
}

export default LoginForm;
